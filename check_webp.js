const fs = require('fs');
const path = require('path');

const file = 'C:\\Users\\djgoo\\.gemini\\antigravity\\brain\\18eb65ca-7eb7-4728-8f26-b45bb3aa90aa\\sprite_sheet_inspection_1773552127477.webp';

function getWebpDimensions(filePath) {
    const buffer = fs.readFileSync(filePath);
    if (buffer.toString('ascii', 8, 12) !== 'WEBP') return null;
    
    // RIFF header is at 0-3, File size at 4-7, WEBP at 8-11
    // VP8X extended format usually has dimensions at 24-29
    // This is a simplified check for extended format
    if (buffer.toString('ascii', 12, 16) === 'VP8X') {
        const width = buffer.readUIntLE(24, 3) + 1;
        const height = buffer.readUIntLE(27, 3) + 1;
        return { width, height };
    }
    return "Basic/Lossy";
}

if (fs.existsSync(file)) {
    const dims = getWebpDimensions(file);
    console.log(`WebP Dims: ${JSON.stringify(dims)}`);
    if (dims && (dims.width === 1920 || dims.width === 1600)) { // 1600 is also common for some gen tools
         console.log("CANDIDATE FOUND!");
    }
} else {
    console.log("File not found");
}
