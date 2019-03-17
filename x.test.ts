import {createServer} from 'http';

const log = () => {};
// const log = console.log;

test('leaks microtask', () => {
  log('start leaks microtask');
  process.nextTick(() => {});
  log('end leaks microtask');
});

test('does not leak microtask', async () => {
  log('start does not leak microtask');
  await Promise.resolve();
  log('end does not leak microtask');
});

test('leaks macrotask', () => {
  log('start leaks macrotask');
  setTimeout(() => {}, 0);
  log('end leaks macrotask');
});

test('does not leak macrotask', done => {
  log('start does not leak macrotask');
  setTimeout(() => {
    log('end does not leak macrotask');
    done();
  }, 0);
});

test('leaks HTTP server', () => {
  log('start leaks HTTP server');
  createServer().listen(0);
  log('end leaks HTTP server');
});

test('does not leak HTTP server', async () => {
  log('start does not leak HTTP server');
  await new Promise(resolve => {
    const server = createServer().listen(0, () => {
      server.close(() => {
        log('end does not leak HTTP server');
        server.removeAllListeners('connection');
        resolve();
      });
    });
  });
});
