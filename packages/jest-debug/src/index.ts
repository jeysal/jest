import 'zone.js';

import {dispatch} from 'jest-circus/build/state';
import {callAsyncCircusFn} from 'jest-circus/build/utils';

Zone.assertZonePatched(); // eslint-disable-line no-undef

export const describe = () => {};

export const test = (testName: string, fn: Function, timeout = 5000) => {
  const taskState = {handler: false, macro: false, micro: false};

  // const tasks = [];
  const testZone = Zone.current.fork({
    name: testName,
    // onScheduleTask: (parentDelegate, current, target, task) => (
    //   tasks.push(task), parentDelegate.scheduleTask(target, task)
    // ),
    onHasTask: (parentDelegate, current, target, state) => {
      // console.log(state);
      taskState.micro = state.microTask;
      taskState.macro = state.macroTask;
      taskState.handler = state.eventTask;
    },
  });
  const wrapped = async () => {
    await callAsyncCircusFn(
      fn.length
        ? done => testZone.run(fn, null, [done])
        : () => testZone.run(fn, null, []),
      {},
      {isHook: false, timeout},
    );
    if (taskState.micro || taskState.macro || taskState.handler) {
      // console.log(tasks);
      throw new Error('Test leaks ' + JSON.stringify(taskState));
    }
  };

  dispatch({
    asyncError: new Error(),
    fn: wrapped,
    mode: undefined,
    name: 'add_test',
    testName,
    timeout,
  });
};
export const it = test;

export const effectForEach = () => {};
export const effectForAll = () => {};

export const beforeAll = () => {};
export const afterAll = () => {};
export const beforeEach = () => {};
export const afterEach = () => {};
