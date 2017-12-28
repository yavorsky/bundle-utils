const fs = require('fs');
const path = require('path');
const examples = require('./examples');

const removeIfExists = location => {
  if (fs.existsSync(location)) {
    fs.unlinkSync(location);
    return true;
  }
  return false;
}

const writeExample = (code, location) => {
  fs.writeFileSync(location, code);
};

const normalizeLocation = filename =>
  path.join(__dirname, '../../app', filename);


const generateRepeatedCode = (code, count) => {
  return code.repeat(count);
}

const generateExample = ({ code, count, filename }) => {
  const location = normalizeLocation(filename);

  removeIfExists(location);
  writeExample(
    generateRepeatedCode(code, count),
    location
  );
};

examples.forEach(generateExample);