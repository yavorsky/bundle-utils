const path = require('path');

const fs = jest.genMockFromModule('fs');

let mockFiles = Object.create(null);
function __setMockFiles(newMockFiles) {
  mockFiles = Object.create(null);
  for (const file in newMockFiles) {

    if (!mockFiles[file]) {
      mockFiles[file] = newMockFiles[file];
	}
  }
}

function readFileSync(filePath) {
  return mockFiles[filePath] || [];
}

fs.__setMockFiles = __setMockFiles;
fs.readFileSync = readFileSync;

module.exports = fs;