const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Potential candidates based on size
const candidates = [
    'C:\\Users\\djgoo\\.gemini\\antigravity\\brain\\18eb65ca-7eb7-4728-8f26-b45bb3aa90aa\\byte_mage_sprite_sheet_clean_1773548065265.png',
    'C:\\Users\\djgoo\\.gemini\antigravity\\brain\\18eb65ca-7eb7-4728-8f26-b45bb3aa90aa\\media__1773419557480.png'
];

candidates.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`Checking ${path.basename(file)}...`);
        // We use powershell to get dimensions as a quick way since we don't have Jimp/Sharp
        const cmd = `powershell -Command "Add-Type -AssemblyName System.Drawing; $img = [System.Drawing.Image]::FromFile('${file}'); Write-Host ($img.Width + 'x' + $img.Height)"`;
        try {
            const out = execSync(cmd).toString().trim();
            console.log(`Dimensions: ${out}`);
            if (out === '1920x1024') {
                console.log(`MATCH FOUND! Converting to Base64...`);
                const b64 = fs.readFileSync(file).toString('base64');
                fs.writeFileSync('mage_b64.txt', b64);
                console.log(`SUCCESS: mage_b64.txt created (${b64.length} chars)`);
            }
        } catch (e) {
            console.log(`Failed to check ${path.basename(file)}`);
        }
    }
});
