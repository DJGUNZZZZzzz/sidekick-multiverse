const fs = require('fs');
const path = require('path');

const tempDir = 'C:\\Users\\djgoo\\.gemini\\antigravity\\brain\\18eb65ca-7eb7-4728-8f26-b45bb3aa90aa\\.tempmediaStorage';

function getPngDimensions(filePath) {
    const buffer = fs.readFileSync(filePath);
    if (buffer.length < 24) return null;
    if (buffer.toString('ascii', 1, 4) !== 'PNG') return null;
    const width = buffer.readInt32BE(16);
    const height = buffer.readInt32BE(20);
    return { width, height };
}

if (!fs.existsSync(tempDir)) {
    console.log("Temp dir not found");
    process.exit(1);
}

const files = fs.readdirSync(tempDir);
console.log(`Scanning ${files.length} files...`);

let found = false;
files.forEach(file => {
    if (file.endsWith('.png')) {
        const fullPath = path.join(tempDir, file);
        try {
            const dims = getPngDimensions(fullPath);
            if (dims && dims.width >= 1000) {
                console.log(`MATCH CANDIDATE: ${file} (${dims.width}x${dims.height})`);
                if (dims.width === 1920 && dims.height === 1024) {
                    console.log("--- ULTIMATE MATCH FOUND! ---");
                    const b64 = fs.readFileSync(fullPath).toString('base64');
                    // Write to the project dir
                    fs.writeFileSync('c:\\Users\\djgoo\\OneDrive\\Desktop\\AI PROJECTS FOLDER\\sidekick-multiverse\\mage_b64.txt', b64);
                    console.log("Saved Base64 to mage_b64.txt");
                    found = true;
                }
            }
        } catch (e) {}
    }
});

if (!found) console.log("No 1920x1024 PNG found in temp storage.");
