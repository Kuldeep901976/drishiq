const detect = require('detect-port');
const { exec } = require('child_process');

const DEFAULT_PORT = 3010;

detect(DEFAULT_PORT).then(port => {
  if (port === DEFAULT_PORT) {
    console.log(`✅ Port ${port} is free. Starting dev server...`);
  } else {
    console.log(`⚠️ Port ${DEFAULT_PORT} is taken. Using ${port} instead.`);
  }

  exec(`next dev -p ${port}`, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error: ${err}`);
      return;
    }
    console.log(stdout);
    console.error(stderr);
  });
});
