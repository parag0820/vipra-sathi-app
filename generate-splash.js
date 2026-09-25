const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ASSETS_PATH = path.join(__dirname, 'assets');
const SOURCE_IMAGE = path.join(ASSETS_PATH, 'icon.png');
const ANDROID_RES_PATH = path.join(__dirname, 'android', 'app', 'src', 'main', 'res');

const DRAWABLE_SIZES = {
  'drawable': 500,
  'drawable-mdpi': 200,
  'drawable-hdpi': 300,
  'drawable-xhdpi': 400,
  'drawable-xxhdpi': 600,
  'drawable-xxxhdpi': 800,
};

async function generateSplashAssets() {
  if (!fs.existsSync(SOURCE_IMAGE)) {
    console.error('logo.png not found!');
    return;
  }

  // Generate Expo assets
  // await sharp(SOURCE_IMAGE).resize(200, 200).toFile(path.join(ASSETS_PATH, 'icon.png'));
  // await sharp(SOURCE_IMAGE).resize(500, 500).toFile(path.join(ASSETS_PATH, 'icon.png'));
  await sharp(SOURCE_IMAGE).resize(432, 432).toFile(path.join(ASSETS_PATH, 'adaptive-icon.png'));
  await sharp(SOURCE_IMAGE).resize(48, 48).toFile(path.join(ASSETS_PATH, 'favicon.png'));
  console.log('Expo assets generated in ./assets/');

  // Generate Android drawable splashscreen_image.png files
  for (const [folder, size] of Object.entries(DRAWABLE_SIZES)) {
    const targetFolder = path.join(ANDROID_RES_PATH, folder);
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }
    const targetFile = path.join(targetFolder, 'splashscreen_image.png');
    const padding = Math.floor(size * 0.2); // 20% padding to prevent clipping
    const innerSize = size - (padding * 2);
    await sharp(SOURCE_IMAGE)
      .resize(innerSize, innerSize)
      .extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toFile(targetFile);
    console.log(`Generated splashscreen_image.png (${size}x${size}) in ${folder}`);
  }

  console.log('Splash assets successfully generated!');
}

generateSplashAssets().catch(console.error);
