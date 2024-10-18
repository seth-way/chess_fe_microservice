require('dotenv').config();
const { spawn } = require('child_process');
console.log('run m s', process.env.RUN_MOCK_SERVER);

// Check if the environment variable RUN_SERVER is set to true
const runServer = process.env.RUN_MOCK_SERVER === 'true';

// Function to run a command
const runCommand = (command, args) => {
	const process = spawn(command, args, { stdio: 'inherit' });
	process.on('close', code => {
		if (code !== 0) {
			console.error(`${command} process exited with code ${code}`);
		}
	});
};

// Run the server if the environment variable is true
if (runServer) {
	console.log('Running Mock Server.');
	runCommand('node', ['./mockServer/server.js']);
}

// Always run Vite
runCommand('vite', []);
