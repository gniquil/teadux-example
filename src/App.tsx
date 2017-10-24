import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Cmds, Command, mcompose } from 'teadux';
import * as counter from './counter';
const { Counter } = counter;

export type State = {
  totalCount: number;
  firstCounter: counter.State;
  secondCounter: counter.State;
};

export const initialState = {
  totalCount: 0,
  firstCounter: counter.initialState,
  secondCounter: counter.initialState,
};

export type Action = First | Second | Init;

export type First = {
  type: 'First';
  nested: counter.Action;
};

export function tagFirst(nested: counter.Action): Action {
  return { type: 'First', nested };
}

export type Second = {
  type: 'Second';
  nested: counter.Action;
};

export function tagSecond(nested: counter.Action): Action {
  return { type: 'Second', nested };
}

export type Init = {
  type: '@@INIT';
};

export type Deps = counter.Deps;

export const deps: Deps = counter.deps;

export function reducer(
  state: State = initialState,
  action: Action,
  { doConvert }: Deps
): [State, Command<Action>[]] {
  switch (action.type) {
    case '@@INIT': {
      return [state, []];
    }
    case 'First': {
      const [subState, subCmds, subInfo] = counter.reducer(
        state.firstCounter,
        action.nested,
        { doConvert }
      );
      return [
        {
          ...state,
          firstCounter: subState,
          totalCount: state.totalCount + (subInfo ? subInfo.current : 0),
        },
        [...Cmds.fmap(tagFirst, subCmds)],
      ];
    }
    case 'Second': {
      const [subState, subCmds, subInfo] = counter.reducer(
        state.secondCounter,
        action.nested,
        { doConvert }
      );
      return [
        {
          ...state,
          secondCounter: subState,
          totalCount: state.totalCount + (subInfo ? subInfo.current : 0),
        },
        [...Cmds.fmap(tagSecond, subCmds)],
      ];
    }
  }
}

type StateProps = {
  state: State;
};

type DispatchProps = {
  dispatch: Dispatch<State>;
};

const mapStateToProps = (state: State): StateProps => ({ state });

class App extends React.Component<StateProps & DispatchProps, {}> {
  dispatchFirst = mcompose(this.props.dispatch, tagFirst);
  dispatchSecond = mcompose(this.props.dispatch, tagSecond);

  render() {
    const { state: { totalCount, firstCounter, secondCounter } } = this.props;
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to Counters</h2>
        </div>
        <div className="">Total Count: {totalCount}</div>
        <div className="counters">
          <Counter
            name="First"
            state={firstCounter}
            dispatch={this.dispatchFirst}
          />
          <Counter
            name="Second"
            state={secondCounter}
            dispatch={this.dispatchSecond}
          />
        </div>
      </div>
    );
  }
}

export default connect<StateProps, DispatchProps, {}>(mapStateToProps)(App);
