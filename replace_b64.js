// Replace the embedded Base64 asset in sidekick_full.js
const fs = require('fs');
const path = require('path');

const jsFile = path.join(__dirname, 'sidekick_full.js');
const b64File = path.join(__dirname, 'sprite_b64.txt');

console.log('Reading files...');
const code = fs.readFileSync(jsFile, 'utf8');
const b64 = fs.readFileSync(b64File, 'utf8').trim();

console.log('JS file length:', code.length);
console.log('B64 data length:', b64.length);

// Find the SM_ASSET_B64 variable assignment
const startMarker = 'var SM_ASSET_B64 = "';
const startIdx = code.indexOf(startMarker);
if (startIdx === -1) {
    console.error('ERROR: Could not find SM_ASSET_B64 variable');
    process.exit(1);
}

// Find the closing ";
const contentStart = startIdx + startMarker.length;
const endIdx = code.indexOf('";', contentStart);
if (endIdx === -1) {
    console.error('ERROR: Could not find end of SM_ASSET_B64 string');
    process.exit(1);
}

const oldB64 = code.substring(contentStart, endIdx);
console.log('Old B64 length:', oldB64.length);
console.log('Old B64 prefix:', oldB64.substring(0, 40));
console.log('New B64 prefix:', b64.substring(0, 40));

// Replace
const newCode = code.substring(0, contentStart) + b64 + code.substring(endIdx);

fs.writeFileSync(jsFile, newCode);
console.log('SUCCESS! New file size:', newCode.length, 'chars');
