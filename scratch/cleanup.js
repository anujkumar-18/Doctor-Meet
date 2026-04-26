const fs = require('fs');
const path = require('path');

const srcDir = 'c:\\docmeet\\app\\(main)';
const destDir = 'c:\\docmeet\\app\\(auth)\\(main)';

function moveRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    if (!exists) return;
    const stats = fs.statSync(src);
    const isDirectory = stats.isDirectory();

    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach((childItemName) => {
            moveRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        if (!fs.existsSync(dest)) {
            // Rename/move file since it doesn't exist
            fs.renameSync(src, dest);
            console.log(`Moved file to: ${dest}`);
        } else {
            // File exists, just ignore it and we'll delete the source later
            console.log(`Skipped existing file: ${dest}`);
        }
    }
}

console.log('Starting cleanup process...');

if (fs.existsSync(srcDir)) {
    moveRecursiveSync(srcDir, destDir);
    // Delete the source directory after moving everything out
    fs.rmSync(srcDir, { recursive: true, force: true });
    console.log(`Deleted directory: ${srcDir}`);
}

// Delete duplicate app/page.js
const duplicatePage = 'c:\\docmeet\\app\\page.js';
if (fs.existsSync(duplicatePage)) {
    fs.unlinkSync(duplicatePage);
    console.log(`Deleted duplicate file: ${duplicatePage}`);
}

// Delete duplicate app/(auth)/layout.js
const duplicateAuthLayout = 'c:\\docmeet\\app\\(auth)\\layout.js';
if (fs.existsSync(duplicateAuthLayout)) {
    fs.unlinkSync(duplicateAuthLayout);
    console.log(`Deleted duplicate file: ${duplicateAuthLayout}`);
}

console.log('Cleanup completed.');
