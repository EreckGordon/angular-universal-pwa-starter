const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

let pathFolder = __dirname.split(path.sep);
let folderLength = pathFolder.length;
let currentFolder = pathFolder[folderLength - parseInt(1)];

let destDir = path.join('..', currentFolder + '-deploy');

process.chdir(destDir);

async function gitAddAll() {
    const { stdout, stderr } = await exec('git add .');
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
}

async function gitCommit() {
    const currentDate = new Date();
    const message = `auto generated commit. current time: ${currentDate}.`;
    const { stdout, stderr } = await exec(`git commit -m \"${message}\"`);
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
}

async function gitPush() {
    const { stdout, stderr } = await exec('git push origin master');
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
}

async function runAll() {
    await gitAddAll();
    await gitCommit();
    await gitPush();
}

runAll();
