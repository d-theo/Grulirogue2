/*
const testFolder = '.';
const fs = require('fs');

fs.readdir(testFolder, (err, files) => {
  files.forEach(file => {
    file = file.split('.');
    fs.appendFileSync('index.ts', "\nexport * from './"+file[0]+"';");
  });
});

*/