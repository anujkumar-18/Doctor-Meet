const fs = require('fs');
const path = require('path');

const srcDir = 'c:\\docmeet_temp_clone';
const destDir = 'c:\\docmeet';

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();

    // Skip the .git folder in the source to avoid submodule issues
    if (path.basename(src) === '.git') return;
    
    // Ignore node_modules
    if (path.basename(src) === 'node_modules') return;

    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
            console.log(`Created directory: ${dest}`);
        }
        fs.readdirSync(src).forEach((childItemName) => {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        if (!fs.existsSync(dest)) {
            fs.copyFileSync(src, dest);
            console.log(`Copied file: ${dest}`);
        }
    }
}

console.log('Starting merge process...');
copyRecursiveSync(srcDir, destDir);
console.log('Merge completed.');
