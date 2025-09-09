const fs = require('node:fs');
const path = require('node:path');

try {
  const dirData = fs.readdirSync(path.resolve(__dirname, './utils'));
  for (const file of dirData) {
    fs.copyFileSync(path.resolve(__dirname, './utils', file), path.resolve(__dirname, '..', 'src/utils', file));
    fs.copyFileSync(path.resolve(__dirname, './utils', file), path.resolve(__dirname, '..', 'frontend/src/utils', file));
  }
} catch (err) {
  console.log('err', err);
}
