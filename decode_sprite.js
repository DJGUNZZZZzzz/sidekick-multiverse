const fs = require('fs');
const content = fs.readFileSync('c:/Users/djgoo/OneDrive/Desktop/AI PROJECTS FOLDER/sidekick-multiverse/sidekick_full.js', 'utf8');
const lines = content.split('\n');
const assetLine = lines[111]; 
const match = assetLine.match(/base64,(.*)"/);
if (match) {
    const b64 = match[1];
    fs.writeFileSync('C:/Users/djgoo/.gemini/antigravity/brain/18eb65ca-7eb7-4728-8f26-b45bb3aa90aa/debug_sprite.jpg', Buffer.from(b64, 'base64'));
    console.log('Sprite decoded successfully.');
} else {
    console.log('Base64 not found.');
}
