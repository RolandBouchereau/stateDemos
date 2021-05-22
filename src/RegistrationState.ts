import { useMemo } from 'react';
import { Effects, useEffectReducer } from './useEffectReducer';
import { tuple } from './utility';

export enum FormState {
  Updating = 'Updating',
  // Validating,
  Validated = 'Validated',
  Submitting = 'Submitting',
  Submitted = 'Submitted'
}

export enum Gender {
  Female = 'female',
  Male = 'male'
}

export type RegistrationData = {
  gender: Gender;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  phone: string;
  state: string;
  acceptedAgreement: boolean;
};

export type RegistrationDataKey = keyof RegistrationData;

export type State = {
  formState: FormState;
  registrationData: RegistrationData;
  validationErrors: ValidationErrors;
};

const updateField = (
  fieldName: RegistrationDataKey,
  fieldValue: string | boolean
) => (state: State): [State, Effects<State>] => {
  const { formState } = state;
  if (formState !== FormState.Updating) {
    console.warn(`Invalid form state for update ${formState}.`);
    return [state, []];
  }

  if (!(fieldName in state.registrationData)) {
    console.warn('Unrecognized RegistrationData field name.');
    return [state, []];
  }

  const registrationData = {
    ...state.registrationData,
    [fieldName]: typeof fieldValue === 'string' ? fieldValue.trim() : fieldValue
  };
  return [{ ...state, registrationData }, []];
};

type ValidationErrors = Partial<{ [K in RegistrationDataKey]: string }>;

type ValidationTest = (
  registrationData: RegistrationData
) => string | undefined;

type Validate = {
  [K in RegistrationDataKey]: ValidationTest;
};

const validate: Validate = {
  acceptedAgreement({
    acceptedAgreement
  }: RegistrationData): string | undefined {
    if (!acceptedAgreement) {
      return 'Your must agree to the terms of use agreement.';
    }
  },
  dob({ dob }: RegistrationData): string | undefined {
    return;
  },
  email({ email }: RegistrationData): string | undefined {
    return;
  },
  firstName({ firstName }: RegistrationData): string | undefined {
    if (firstName === '') {
      return 'First name is required.';
    }
  },
  gender({ gender }: RegistrationData): string | undefined {
    return;
  },
  lastName({ lastName }: RegistrationData): string | undefined {
    if (lastName === '') {
      return 'Last name is required.';
    }
  },
  phone({ phone }: RegistrationData): string | undefined {
    return;
  },
  state({ state }: RegistrationData): string | undefined {
    return;
  }
};

const validateField = (fieldName: RegistrationDataKey) => (
  state: State
): [State, Effects<State>] => {
  const { formState } = state;
  if (formState !== FormState.Updating) {
    console.warn(`Invalid form state for validation ${formState}.`);
    return [state, []];
  }
  const { registrationData, validationErrors } = state;

  const validationError = validate[fieldName](registrationData);
  if (
    (validationErrors[fieldName] === undefined &&
      validationError === undefined) ||
    validationErrors[fieldName] === validationError
  ) {
    return [state, []];
  }

  const newValidationErrors = { ...validationErrors };
  if (validationError === undefined) {
    delete newValidationErrors[fieldName];
  } else {
    newValidationErrors[fieldName] = validationError;
  }
  return [{ ...state, validationErrors: newValidationErrors }, []];
};

const validateRegistrationData = (state: State): [State, Effects<State>] => {
  const { formState } = state;
  if (formState !== FormState.Updating) {
    console.warn(`Invalid form state for validation ${formState}.`);
    return [state, []];
  }

  const { registrationData } = state;
  const newValidationErrors = Object.keys(validate).reduce(
    (validationErrors: ValidationErrors, fieldName: string) => {
      const validationError = validate[fieldName as RegistrationDataKey](
        registrationData
      );
      if (validationError !== undefined) {
        validationErrors[fieldName as RegistrationDataKey] = validationError;
      }
      return validationErrors;
    },
    {}
  );

  const newFormState =
    Object.keys(newValidationErrors).length > 0
      ? FormState.Updating
      : FormState.Validated;

  return [
    {
      ...state,
      formState: newFormState,
      validationErrors: newValidationErrors
    },
    []
  ];
};

const submissionStarted = (f: () => Promise<void>) => (
  state: State
): [State, Effects<State>] => {
  const { formState } = state;
  if (formState !== FormState.Updating) {
    console.warn(`Invalid form state for submission ${formState}.`);
    return [state, []];
  }

  const [validatedState, effects] = validateRegistrationData(state);
  if (validatedState.formState !== FormState.Validated) {
    return [validatedState, effects];
  }

  f().then(); // Start promise operation, but don't use the result here.

  return [{ ...state, formState: FormState.Submitting }, effects];
};

const submissionSucceeded = (state: State): [State, Effects<State>] => {
  const { formState } = state;
  if (formState !== FormState.Submitting) {
    console.error(`Invalid form state for completing submission ${formState}.`);
    return [state, []];
  }

  return [{ ...state, formState: FormState.Submitted }, []];
};

const submissionFailed = (state: State): [State, Effects<State>] => {
  const { formState } = state;
  if (formState !== FormState.Submitting) {
    console.error(`Invalid form state for completing submission ${formState}.`);
    return [state, []];
  }

  return [{ ...state, formState: FormState.Updating }, []];
};

const logToConsole = (msg: string) => (
  state: State
): [State, Effects<State>] => {
  console.log('logging console message:', msg);
  return [state, []];
};

const emptyRegistrationData: RegistrationData = {
  acceptedAgreement: false,
  dob: '',
  email: '',
  firstName: '',
  gender: Gender.Female,
  lastName: '',
  phone: '',
  state: ''
};

const initialState: State = {
  formState: FormState.Updating,
  registrationData: emptyRegistrationData,
  validationErrors: {}
};

type RegistrationActions = {
  updateField: (
    fieldName: RegistrationDataKey,
    fieldValue: string | boolean
  ) => void;
  validateField: (fieldName: RegistrationDataKey) => void;
  // validateRegistrationData: () => void;
  submitRegistrationData: () => void;
};

let simulateFailure = false;

const simulateSubmission = () =>
  new Promise<void>((resolve, reject) =>
    setTimeout(() => {
      simulateFailure ? reject() : resolve();
      simulateFailure = !simulateFailure;
    }, 3000)
  );

export const useRegistrationState: () => [State, RegistrationActions] = () => {
  const [state, dispatch] = useEffectReducer(initialState);

  const actions: RegistrationActions = useMemo(() => {
    const submissionStartedSync = (f: () => Promise<void>) =>
      dispatch(submissionStarted(f));
    const submissionSucceededSync = () => dispatch(submissionSucceeded);
    const submissionFailedSync = () => dispatch(submissionFailed);

    return {
      updateField: (
        fieldName: RegistrationDataKey,
        fieldValue: string | boolean
      ) => dispatch(updateField(fieldName, fieldValue)),

      validateField: (fieldName: RegistrationDataKey) =>
        dispatch(validateField(fieldName)),

      // validateRegistrationData: () => dispatch(validateRegistrationData),

      submitRegistrationData: () =>
        submissionStartedSync(() =>
          simulateSubmission()
            .then(submissionSucceededSync)
            .catch(submissionFailedSync)
        )
    };
  }, [dispatch]);

  return tuple(state, actions);
};
