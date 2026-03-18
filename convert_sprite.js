/**
 * Convert JPEG sprite sheet with baked-in checkered transparency
 * into a proper PNG with real alpha channel.
 * 
 * The checkered pattern is white (#FFFFFF) + light grey (#C0C0C0ish).
 * Characters are dark purple, cyan, orange — highly saturated.
 * Strategy: pixels with high brightness + low saturation = background → transparent.
 */
const sharp = require('sharp');
const path = require('path');

const INPUT = path.join(
    'C:\\Users\\djgoo\\OneDrive\\Desktop\\AI PROJECTS FOLDER\\SPRITE SHEETS FOR SIDEKICKS',
    'grok-image-f53c4bf0-b2b8-422c-be0a-4f14340fcba5.png'
);
const OUTPUT_PNG = path.join(
    'C:\\Users\\djgoo\\OneDrive\\Desktop\\AI PROJECTS FOLDER\\sidekick-multiverse',
    'mage_sprite_clean.png'
);

async function convert() {
    console.log('Loading image...');
    const img = sharp(INPUT);
    const meta = await img.metadata();
    console.log(`Input: ${meta.width}x${meta.height}, format: ${meta.format}, channels: ${meta.channels}`);

    // Get raw RGBA pixel data
    const { data, info } = await img
        .ensureAlpha() // Add alpha channel if missing
        .raw()
        .toBuffer({ resolveWithObject: true });

    console.log(`Raw pixels: ${info.width}x${info.height}, channels: ${info.channels}`);

    const w = info.width;
    const h = info.height;
    const channels = info.channels; // Should be 4 (RGBA)

    let removedCount = 0;
    let totalPixels = w * h;

    for (let i = 0; i < data.length; i += channels) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const maxC = Math.max(r, g, b);
        const minC = Math.min(r, g, b);
        const spread = maxC - minC;  // Color saturation indicator
        const brightness = (r + g + b) / 3;

        // Background detection:
        // The checkered pattern alternates near-white and light-grey
        // Both have very low color spread and high brightness
        // Characters are dark purple (low brightness) or have color (high spread)
        if (spread < 35 && brightness > 160) {
            // This is a background pixel (white or grey check)
            data[i + 3] = 0; // Set alpha to 0 (fully transparent)
            removedCount++;
        }
        // Anti-aliased edge pixels: partially transparent
        else if (spread < 25 && brightness > 130) {
            data[i + 3] = Math.min(255, Math.max(0, Math.floor((brightness - 130) / 30 * 255)));
            data[i + 3] = 255 - data[i + 3]; // Invert: brighter = more transparent
        }
    }

    console.log(`Removed ${removedCount}/${totalPixels} background pixels (${(removedCount/totalPixels*100).toFixed(1)}%)`);

    // Write the processed data as PNG
    await sharp(data, { raw: { width: w, height: h, channels: channels } })
        .png()
        .toFile(OUTPUT_PNG);

    console.log(`Saved: ${OUTPUT_PNG}`);

    // Verify the output
    const outMeta = await sharp(OUTPUT_PNG).metadata();
    console.log(`Output: ${outMeta.width}x${outMeta.height}, format: ${outMeta.format}, channels: ${outMeta.channels}`);
    
    // Also generate Base64 for embedding
    const pngBuffer = await sharp(OUTPUT_PNG).toBuffer();
    const b64 = 'data:image/png;base64,' + pngBuffer.toString('base64');
    const b64File = path.join(
        'C:\\Users\\djgoo\\OneDrive\\Desktop\\AI PROJECTS FOLDER\\sidekick-multiverse',
        'sprite_b64.txt'
    );
    require('fs').writeFileSync(b64File, b64);
    console.log(`Base64 saved: ${b64File} (${b64.length} chars)`);
    console.log(`Grid: 6 cols x 8 rows = ${Math.round(outMeta.width/6)}x${Math.round(outMeta.height/8)} per frame`);
}

convert().catch(err => {
    console.error('ERROR:', err.message);
    process.exit(1);
});
