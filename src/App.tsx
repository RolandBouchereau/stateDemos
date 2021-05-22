import React, { useState } from 'react';

interface HeadingProps {
  guess: number | null;
  guessedCorrectly: boolean;
}

interface GuessButtonProps {
  guesses: number[];
  secretNumber: number | null;
  n: number;
  guessedCorrectly: boolean;

  playerGuessed(n: number): void;
}

interface GuessButtonsProps {
  guesses: number[];
  secretNumber: number | null;
  numbers: number[];
  guessedCorrectly: boolean;

  playerGuessed(n: number): void;
}

interface TryAgainButtonProps {
  guessedCorrectly: boolean;

  newSecretNumberRequested(): void;
}

const wasGuessed = (guesses: number[], n: number) => guesses.includes(n);

const isCorrectGuess = (secretNumber: number | null, n: number) =>
  n && secretNumber && n === secretNumber;

const numberColor = (
  guesses: number[],
  secretNumber: number | null,
  n: number
) => {
  if (wasGuessed(guesses, n)) {
    if (isCorrectGuess(secretNumber, n)) {
      return 'blue';
    } else {
      return 'red';
    }
  } else {
    return 'green';
  }
};

const MaybeTryAgainButton: React.FC<TryAgainButtonProps> = (
  props: TryAgainButtonProps
) => {
  const { guessedCorrectly, newSecretNumberRequested } = props;
  if (guessedCorrectly)
    return (
      <button
        className="button is-outlined is-hovered"
        onClick={newSecretNumberRequested}
      >
        Try a new number
      </button>
    );
  else return <></>;
};

const GuessButton: React.FC<GuessButtonProps> = (props: GuessButtonProps) => {
  const { guesses, secretNumber, guessedCorrectly, n, playerGuessed } = props;
  return (
    <button
      className="button is-hovered"
      style={{ color: numberColor(guesses, secretNumber, n) }}
      disabled={guessedCorrectly || wasGuessed(guesses, n)}
      onClick={() => playerGuessed(n)}
    >
      {n}
    </button>
  );
};

const Heading: React.FC<HeadingProps> = (props: HeadingProps) => {
  const { guess, guessedCorrectly } = props;
  if (guess === null) {
    return <>Guess my number! Ha-Ha!!</>;
  } else if (guessedCorrectly) {
    return <>"{guess}" is Correct!</>;
  } else {
    return <>Nope, not "{guess}". Try again!</>;
  }
};

const GuessButtons: React.FC<GuessButtonsProps> = (
  props: GuessButtonsProps
) => {
  const {
    guessedCorrectly,
    guesses,
    secretNumber,
    numbers,
    playerGuessed
  } = props;
  return (
    <>
      {numbers.map((n) => (
        <GuessButton
          key={n}
          n={n}
          guessedCorrectly={guessedCorrectly}
          guesses={guesses}
          playerGuessed={playerGuessed}
          secretNumber={secretNumber}
        />
      ))}
    </>
  );
};

const getSecretNumber = (): number => Math.floor(Math.random() * 6 + 1);

const App = () => {
  const [guesses, setGuesses] = useState<Array<number>>([]);
  const [secretNumber, setSecretNumber] = useState<number | null>(
    Math.floor(Math.random() * 6 + 1)
  );

  const guess = guesses.length === 0 ? null : guesses[0];

  const guessedCorrectly = secretNumber !== null && guess === secretNumber;
  const playerGuessed = (n: number) => setGuesses([n, ...guesses]);

  const newSecretNumberRequested = () => {
    setSecretNumber(getSecretNumber());
    setGuesses([]);
  };

  return (
    <section className="hero">
      <div className="hero-body">
        <div className="container">
          <h1 className="title">
            <Heading guess={guess} guessedCorrectly={guessedCorrectly} />
            <MaybeTryAgainButton
              guessedCorrectly={guessedCorrectly}
              newSecretNumberRequested={newSecretNumberRequested}
            />
          </h1>
          <article className="tile is-child notification is-primary is-info is-bold">
            <GuessButtons
              numbers={[1, 2, 3, 4, 5, 6]}
              guesses={guesses}
              guessedCorrectly={guessedCorrectly}
              secretNumber={secretNumber}
              playerGuessed={playerGuessed}
            />
          </article>
        </div>
      </div>
    </section>
  );
};

export default App;
