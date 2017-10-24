import * as React from 'react';
import {
  Cmd,
  Command,
  actionCreator,
  effect,
  Dispatch,
  mcompose,
} from 'teadux';
const romanize = require('romanize');

export type State = {
  counter: number;
  comment: string | null;
};

export const initialState: State = { counter: 0, comment: null };

export type Action = Increment | Decrement | Update;

export type Increment = {
  type: 'Increment';
};

export function increment(): Action {
  return { type: 'Increment' };
}

export type Decrement = {
  type: 'Decrement';
};

export function decrement(): Action {
  return { type: 'Decrement' };
}

export type Update = {
  type: 'Update';
  comment: string;
};

export function update(comment: string): Action {
  return { type: 'Update', comment };
}

export type Info = {
  current: number;
};

export type Deps = {
  doConvert: (n: number) => Promise<string>;
};

export const deps: Deps = {
  doConvert: convert,
};

export function reducer(
  state: State = initialState,
  action: Action,
  { doConvert }: Deps
): [State, Command<Action>[], Info | null] {
  switch (action.type) {
    case 'Increment': {
      const counter = state.counter + 1;
      return [
        { ...state, counter },
        [
          Cmd.run(effect(doConvert, counter), {
            success: actionCreator(update),
          }),
        ],
        { current: counter },
      ];
    }
    case 'Decrement': {
      const counter = state.counter - 1;
      return [
        { ...state, counter },
        [
          Cmd.run(effect(doConvert, counter), {
            success: actionCreator(update),
          }),
        ],
        { current: counter },
      ];
    }
    case 'Update': {
      return [{ ...state, comment: action.comment }, [], null];
    }
  }
}

function delay(n: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, n);
  });
}

function convert(n: number): Promise<string> {
  if (n < 0) {
    return delay(1000).then(() => `NEG ${romanize(Math.abs(n))}`);
  } else if (n === 0) {
    return delay(1000).then(() => 'ZERO');
  } else {
    return delay(1000).then(() => romanize(n));
  }
}

export type Props = { name: string; state: State; dispatch: Dispatch<Action> };

export const Counter = ({
  name,
  state: { counter, comment },
  dispatch,
}: Props) => {
  const up = mcompose(dispatch, increment);
  const down = mcompose(dispatch, decrement);
  return (
    <div className="Counter">
      <h3>{name}</h3>
      <h1>{counter}</h1>
      <p>{comment || 'Click!'}</p>
      <div className="actions">
        <button onClick={up}>Up</button>
        <button onClick={down}>Down</button>
      </div>
    </div>
  );
};
