const fs = require('fs');
const path = require('path');
const os = require('os');
const fse = require('fs-extra');

let filesToCopy = ['package.json', 'yarn.lock'];
let foldersToCopy = ['dist'];

function copyFile(src, dest) {

  let readStream = fs.createReadStream(src);

  readStream.once('error', (err) => {
    console.log(err);
  });

  readStream.once('end', () => {
    console.log('done copying');
  });

  readStream.pipe(fs.createWriteStream(dest));
}

let pathFolder;
if (os.platform() == 'win32') {
  // Windows
  pathFolder = __dirname.split("\\");
} else {
  // Linux / MacOS
  pathFolder = __dirname.split("/");
}

let folderLength = pathFolder.length;
let currentFolder = pathFolder[folderLength - parseInt(1)];

filesToCopy.forEach(file => {
  let src = path.join(__dirname, file);
  let destDir = path.join('..', currentFolder + '-deploy');
  fs.access(destDir, (err) => {
    if(err)
    console.log('error', err)

    copyFile(src, path.join(destDir, file));
  });    
});

foldersToCopy.forEach(folder => {
  let src = path.join(__dirname, folder);
  let destDir = path.join('..', currentFolder + '-deploy', folder);
  fse.removeSync(destDir);
  fse.copy(src, destDir, (err) => {
    if (err) console.log(err)
    console.log(`successfully moved ${folder}`)
  })
})