import {addEventHandler, getState} from 'jest-circus';
import {callAsyncCircusFn} from 'jest-circus/build/utils';
import {TestEntry} from 'jest-circus/build/types';

import 'zone.js';

// eslint-disable no-undef
Zone.assertZonePatched();

addEventHandler((event, state) => {
  switch (event.name) {
    case 'add_test':
      const test = state.currentDescribeBlock.tests.find(
        ({name}) => name === event.testName,
      );
      if (test) {
        wrapTest(test);
      } else {
        event.asyncError.message = 'missing test';
      }
      break;
  }
});

const wrapTest = (test: TestEntry) => {
  const taskState = {handler: false, macro: false, micro: false};
  const {fn} = test;

  // const tasks = [];
  const testZone = Zone.current.fork({
    name: test.name,
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
  const wrapped = async function() {
    await callAsyncCircusFn(
      fn.length
        ? done => testZone.run(fn, this, [done])
        : () => testZone.run(fn, this, []),
      this,
      {isHook: false, timeout: test.timeout || getState().testTimeout},
    );
    if (taskState.micro || taskState.macro || taskState.handler) {
      // console.log(tasks);
      throw new Error('Test leaks ' + JSON.stringify(taskState));
    }
  };

  test.fn = wrapped;
};
