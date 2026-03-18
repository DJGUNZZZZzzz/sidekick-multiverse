const fs = require('fs');

const b64 = fs.readFileSync('c:\\Users\\djgoo\\OneDrive\\Desktop\\AI PROJECTS FOLDER\\sidekick-multiverse\\mage_b64.txt', 'utf8').trim();
const jsPath = 'c:\\Users\\djgoo\\OneDrive\\Desktop\\AI PROJECTS FOLDER\\sidekick-multiverse\\sidekick_full.js';
let js = fs.readFileSync(jsPath, 'utf8');

const marker = 'var SM_ASSET_B64 = ""; // EMBED_MARKER';
const replacement = `var SM_ASSET_B64 = "data:image/jpeg;base64,${b64}"; // EMBED_MARKER`;

if (js.includes(marker)) {
    js = js.replace(marker, replacement);
    fs.writeFileSync(jsPath, js);
    console.log("SUCCESS: Asset embedded in sidekick_full.js!");
} else {
    console.log("ERROR: Marker not found in js file.");
}
