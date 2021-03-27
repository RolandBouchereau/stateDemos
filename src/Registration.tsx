import React, { ChangeEvent, FC, FocusEvent, FormEvent } from 'react';
import {
  FormState,
  Gender,
  RegistrationDataKey,
  useRegistrationState
} from './RegistrationState';

export const Registration: FC = () => {
  const [
    { formState, registrationData, validationErrors },
    { updateField, validateField, submitRegistrationData }
  ] = useRegistrationState();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log('SUBMIT');

    submitRegistrationData();
  };
  // console.log(formState, validationErrors, registrationData);

  const handleFieldChanged = ({
    target: { name, value }
  }: ChangeEvent<HTMLInputElement>) =>
    updateField(name as RegistrationDataKey, value);

  const handleCheckedFieldChanged = ({
    target: { name, checked }
  }: ChangeEvent<HTMLInputElement>) =>
    updateField(name as RegistrationDataKey, checked);

  const handleFieldBlur = ({
    target: { name }
  }: FocusEvent<HTMLInputElement>) =>
    validateField(name as RegistrationDataKey);

  return (
    <div className="columns">
      <div className="c25" />
      <div className="c33">
        <form onSubmit={onSubmit}>
          <fieldset>
            <legend>
              <label>Gender</label>
            </legend>
            <label>
              <input
                type="radio"
                name="gender"
                value={Gender.Female}
                checked={registrationData.gender === Gender.Female}
                onChange={handleFieldChanged}
              />
              &nbsp; Female
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value={Gender.Male}
                checked={registrationData.gender === Gender.Male}
                onChange={handleFieldChanged}
              />
              &nbsp; Male
            </label>
          </fieldset>
          <p className={validationErrors.gender && 'validationError'}>
            {validationErrors.gender}
          </p>

          <label htmlFor="firstName">Name</label>
          <input
            className={validationErrors.firstName && 'validationError'}
            type="text"
            placeholder="First name"
            id="firstName"
            name="firstName"
            value={registrationData.firstName}
            onChange={handleFieldChanged}
            onBlur={handleFieldBlur}
          />
          <p className={validationErrors.firstName && 'validationError'}>
            {validationErrors.firstName}
          </p>

          <input
            className={validationErrors.lastName && 'validationError'}
            type="text"
            placeholder="Last name"
            id="lastName"
            name="lastName"
            value={registrationData.lastName}
            onChange={handleFieldChanged}
            onBlur={handleFieldBlur}
          />
          <p className={validationErrors.lastName && 'validationError'}>
            {validationErrors.lastName}
          </p>

          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="sample@xyz.com"
            id="email"
            name="email"
          />

          <label htmlFor="dob">Date of birth</label>
          <input type="date" id="dob" name="dob" />

          <label htmlFor="phone">Contact phone number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="(213) 555-1580"
          />

          <label htmlFor="state">State</label>
          <select id="state" name="state">
            <option value="CA">California</option>
            <option value="NY">New York</option>
          </select>

          <label htmlFor="acceptedAgreement">
            I accept the License Agreement
          </label>
          <input
            type="checkbox"
            id="acceptedAgreement"
            name="acceptedAgreement"
            onChange={handleCheckedFieldChanged}
            onBlur={handleFieldBlur}
          />
          <p
            className={validationErrors.acceptedAgreement && 'validationError'}
          >
            {validationErrors.acceptedAgreement}
          </p>

          <div>
            <input
              disabled={formState !== FormState.Updating}
              type="submit"
              id="submitButton"
              name="submitButton"
              value="Register"
            />
          </div>
        </form>
      </div>
    </div>
  );
};
