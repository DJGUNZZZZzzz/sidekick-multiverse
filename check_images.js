const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\djgoo\\.gemini\\antigravity\\brain\\18eb65ca-7eb7-4728-8f26-b45bb3aa90aa';
const files = fs.readdirSync(dir);

console.log("--- IMAGE SCAN ---");
files.forEach(file => {
    if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.webp')) {
        const fullPath = path.join(dir, file);
        const stats = fs.statSync(fullPath);
        if (stats.size > 10000) {
            console.log(`${file}: ${stats.size} bytes`);
        }
    }
});
