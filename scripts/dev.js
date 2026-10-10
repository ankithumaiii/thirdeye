import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

console.log('👁️  Starting ThirdEye Bystander Crisis Intervention Suite...');

const backend = spawn(npmCmd, ['run', 'dev', '--prefix', 'backend'], {
  cwd: root,
  stdio: 'inherit',
  shell: true
});

const frontend = spawn(npmCmd, ['run', 'dev', '--prefix', 'frontend'], {
  cwd: root,
  stdio: 'inherit',
  shell: true
});

function cleanup() {
  console.log('\n🛑 Shutting down ThirdEye services...');
  backend.kill('SIGINT');
  frontend.kill('SIGINT');
  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
