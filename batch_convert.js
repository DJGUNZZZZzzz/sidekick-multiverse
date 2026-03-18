const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/djgoo/OneDrive/Desktop/AI PROJECTS FOLDER/SPRITE SHEETS FOR SIDEKICKS/MAGE';
const outputDir = 'C:/Users/djgoo/OneDrive/Desktop/AI PROJECTS FOLDER/sidekick-multiverse/assets';
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));

async function processFile(f) {
    console.log(`Processing ${f}...`);
    const inputPath = path.join(dir, f);
    const img = sharp(inputPath);
    const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });

    const channels = info.channels;
    for (let i = 0; i < data.length; i += channels) {
        const r = data[i], g = data[i+1], b = data[i+2];
        const maxC = Math.max(r, g, b), minC = Math.min(r, g, b);
        const spread = maxC - minC, brightness = (r+g+b)/3;

        if (spread < 35 && brightness > 160) {
            data[i + 3] = 0;
        } else if (spread < 25 && brightness > 130) {
            data[i + 3] = Math.min(255, Math.max(0, 255 - Math.floor((brightness - 130) / 30 * 255)));
        }
    }

    const outputName = f.replace(/\.(png|jpg|jpeg)/gi, '_clean.png');
    const outputPath = path.join(outputDir, outputName);
    
    await sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
        .png().toFile(outputPath);

    const b64 = (await fs.promises.readFile(outputPath)).toString('base64');
    return { name: f, b64: `data:image/png;base64,${b64}` };
}

async function run() {
    const results = [];
    for (const f of files) {
        try {
            results.push(await processFile(f));
        } catch (e) {
            console.error(`Error processing ${f}: ${e.message}`);
        }
    }
    fs.writeFileSync(path.join(outputDir, 'mage_assets.json'), JSON.stringify(results, null, 2));
    console.log('Batch conversion complete. Data saved to assets/mage_assets.json');
}

run();
