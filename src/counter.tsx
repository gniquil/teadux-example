import * as React from 'react';
import { Cmd, CmdType, Dispatch, wrap } from 'teadux';

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

export function reducer(
  state: State = initialState,
  action: Action
): [State, CmdType<Action>[], Info | null] {
  switch (action.type) {
    case 'Increment': {
      const counter = state.counter + 1;
      return [
        { ...state, counter },
        [
          Cmd.run(Cmd.fn(doConvert, counter), {
            success: Cmd.fn(update),
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
          Cmd.run(Cmd.fn(doConvert, counter), {
            success: Cmd.fn(update),
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

function doConvert(n: number): Promise<string> {
  switch (n) {
    case 0:
      return Promise.resolve('zero');
    case 1:
      return Promise.resolve('one');
    case 2:
      return Promise.resolve('two');
    case 3:
      return Promise.resolve('three');
    case 4:
      return Promise.resolve('four');
    case -1:
      return Promise.resolve('neg one');
    case -2:
      return Promise.resolve('neg two');
    case -3:
      return Promise.resolve('neg three');
    case -4:
      return Promise.resolve('neg four');
    default:
      return Promise.resolve('what?');
  }
}

export type Props = { name: string; state: State; dispatch: Dispatch<Action> };

export const Counter = ({
  name,
  state: { counter, comment },
  dispatch,
}: Props) => {
  const up = wrap(dispatch, increment);
  const down = wrap(dispatch, decrement);
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
