const fs = require('fs');
const path = require('path');

const srcDir = 'c:\\docmeet_temp_clone3';
const destDir = 'c:\\docmeet';

const keepList = ['.git', '.env', 'node_modules', 'scratch', 'package-lock.json'];

// 1. Delete everything in destDir EXCEPT the keepList
function cleanDest(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
        if (keepList.includes(item)) continue;
        const itemPath = path.join(dir, item);
        const stats = fs.statSync(itemPath);
        if (stats.isDirectory()) {
            fs.rmSync(itemPath, { recursive: true, force: true });
        } else {
            fs.unlinkSync(itemPath);
        }
    }
}

// 2. Copy everything from srcDir to destDir EXCEPT .git
function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();

    if (path.basename(src) === '.git') return;

    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach((childItemName) => {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

console.log('Cleaning destination...');
cleanDest(destDir);
console.log('Copying new files...');
copyRecursiveSync(srcDir, destDir);
console.log('Replacement complete.');
