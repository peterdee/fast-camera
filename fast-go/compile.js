import { exec } from 'node:child_process';

exec(
  'cd ./fast-go && GOOS=js GOARCH=wasm go build -o ../public/bin.wasm',
  (error, _, stderr) => {
    if (error) {
      throw error;
    }
    if (stderr) {
      throw stderr;
    }
    return process.exit(0);
  },
);
