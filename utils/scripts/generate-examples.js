const fs = require('fs-extra');
const path = require('path');
const examples = require('./examples');

const createIfNotExists = location => {
  if (!fs.existsSync(location)) {
    fs.mkdirSync(location);
    return true;
  }
  return false;
};

const removeIfExists = (location, dir) => {
  if (fs.existsSync(location)) {
    if (dir) {
      fs.emptyDirSync(location);
      fs.rmdirSync(location);
      return true;
    }
    return true;
  }
  return false;
};

const copyFile = (fileLoc, newLoc) => {
  removeIfExists(newLoc);
  fs.copySync(fileLoc, newLoc);
  // fs.createReadStream(fileLoc).pipe(fs.createWriteStream(newLoc));
};

const writeExample = (code, location) => {
  fs.writeFileSync(location, code);
};

const normalizeDistDirectory = dirname => {
  return path.join(__dirname, '../../test/webpack/fixtures', dirname, 'dist');
};

const normalizeAppDirectory = dirname => {
  return path.join(__dirname, '../../test/webpack/fixtures', dirname, 'app');
};

const normalizeLocation = (filename, dirname) => {
  return path.join(normalizeAppDirectory(dirname), filename);
};

const generateRepeatedCode = (code, count) => {
  return code.repeat(count);
};

const generateExample = ({
 dirname, code, count, filename
}) => {
  const location = normalizeLocation(filename, dirname);

  removeIfExists(location);
  writeExample(generateRepeatedCode(code, count), location);
};

const getImportsFromExamples = examples => {
  return examples.reduce((total, current) => {
    return total.concat(`import './${current.filename.slice(0, -3)}';
`);
  }, '');
};

const generateExamples = dirname => {
  const appDir = normalizeAppDirectory(dirname);
  createIfNotExists(appDir);
  examples.forEach(example => generateExample({ ...example, dirname }));
  const mainFileCode = getImportsFromExamples(examples);
  writeExample(mainFileCode, normalizeLocation('main.js', dirname));
  copyFile(
    path.join(__dirname, './templates/index.html'),
    normalizeLocation('index.html', dirname),
  );
};

const removeExamples = dirname => {
  const appDir = normalizeAppDirectory(dirname);
  const distDir = normalizeDistDirectory(dirname);
  removeIfExists(appDir, true);
  removeIfExists(distDir, true);
};

module.exports.generateExamples = generateExamples;
module.exports.removeExamples = removeExamples;
