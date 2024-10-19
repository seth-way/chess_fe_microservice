import dotenv from 'dotenv';
import { spawn } from 'child_process';

dotenv.config();
// eslint-disable-next-line no-undef
const runServer = process.env.RUN_MOCK_SERVER === 'true';

const runCommand = (command, args) => {
  const process = spawn(command, args, { stdio: 'inherit' });
  process.on('close', code => {
    if (code !== 0) {
      console.error(`${command} process exited with code ${code}`);
    }
  });
};

if (runServer) {
  console.log('Running Mock Server.');
  runCommand('node', ['./mockServer/server.js']);
}

runCommand('vite', []);
