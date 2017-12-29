const fs = require('fs');
const path = require('path');
const examples = require('./examples');

const removeIfExists = location => {
  if (fs.existsSync(location)) {
    fs.unlinkSync(location);
    return true;
  }
  return false;
};

const copyFile = (fileLoc, newLoc) => {
  removeIfExists(newLoc);
  fs.createReadStream(fileLoc).pipe(fs.createWriteStream(newLoc));
};

const writeExample = (code, location) => {
  fs.writeFileSync(location, code);
};

const normalizeLocation = filename =>
  path.join(__dirname, '../../app', filename);

const generateRepeatedCode = (code, count) => {
  return code.repeat(count);
};

const generateExample = ({ code, count, filename }) => {
  const location = normalizeLocation(filename);

  removeIfExists(location);
  writeExample(generateRepeatedCode(code, count), location);
};

const getImportsFromExamples = examples => {
  return examples.reduce((total, current) => {
    return total.concat(`import './${current.filename.slice(0, -3)}';
`);
  }, '');
};

examples.forEach(generateExample);
const mainFileCode = getImportsFromExamples(examples);
writeExample(mainFileCode, normalizeLocation('main.js'));
copyFile(
  path.join(__dirname, './templates/index.html'),
  normalizeLocation('index.html'),
);
