const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\djgoo\\..gemini\\antigravity\\brain\\18eb65ca-7eb7-4728-8f26-b45bb3aa90aa';
// Wait, the path has one dot like C:\Users\djgoo\.gemini\...
const correctDir = 'C:\\Users\\djgoo\\.gemini\\antigravity\\brain\\18eb65ca-7eb7-4728-8f26-b45bb3aa90aa';

function getPngDimensions(filePath) {
    const buffer = fs.readFileSync(filePath);
    if (buffer.toString('ascii', 1, 4) !== 'PNG') return null;
    const width = buffer.readInt32BE(16);
    const height = buffer.readInt32BE(20);
    return { width, height };
}

const files = fs.readdirSync(correctDir);
files.forEach(file => {
    if (file.endsWith('.png')) {
        const fullPath = path.join(correctDir, file);
        try {
            const dims = getPngDimensions(fullPath);
            if (dims) {
                console.log(`${file}: ${dims.width}x${dims.height}`);
                if (dims.width === 1920 && dims.height === 1024) {
                    console.log(`--- MATCH! ---`);
                    const b64 = fs.readFileSync(fullPath).toString('base64');
                    fs.writeFileSync('C:\\Users\\djgoo\\OneDrive\\Desktop\\AI PROJECTS FOLDER\\sidekick-multiverse\\mage_b64.txt', b64);
                    console.log(`Saved to mage_b64.txt`);
                }
            }
        } catch (e) {}
    }
});
