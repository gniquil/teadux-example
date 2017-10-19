import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Cmd, CmdType, wrap } from 'teadux';
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
  subAction: counter.Action;
};

export function tagFirst(subAction: counter.Action): Action {
  return { type: 'First', subAction };
}

export type Second = {
  type: 'Second';
  subAction: counter.Action;
};

export function tagSecond(subAction: counter.Action): Action {
  return { type: 'Second', subAction };
}

export type Init = {
  type: '@@INIT';
};

export function reducer(
  state: State = initialState,
  action: Action
): [State, CmdType<Action>[]] {
  switch (action.type) {
    case '@@INIT': {
      return [state, []];
    }
    case 'First': {
      const [subState, subCmds, subInfo] = counter.reducer(
        state.firstCounter,
        action.subAction
      );
      return [
        {
          ...state,
          firstCounter: subState,
          totalCount: state.totalCount + (subInfo ? subInfo.current : 0),
        },
        [...Cmd.map(tagFirst, subCmds)],
      ];
    }
    case 'Second': {
      const [subState, subCmds, subInfo] = counter.reducer(
        state.firstCounter,
        action.subAction
      );
      return [
        {
          ...state,
          secondCounter: subState,
          totalCount: state.totalCount + (subInfo ? subInfo.current : 0),
        },
        [...Cmd.map(tagSecond, subCmds)],
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
  dispatchFirst = wrap(this.props.dispatch, tagFirst);
  dispatchSecond = wrap(this.props.dispatch, tagSecond);

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
