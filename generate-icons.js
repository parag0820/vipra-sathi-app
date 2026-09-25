const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOURCE_IMAGE = path.join(__dirname, 'assets', 'icon.png');
const ANDROID_RES_PATH = path.join(__dirname, 'android', 'app', 'src', 'main', 'res');
const IOS_ICON_PATH = path.join(__dirname, 'ios', 'VipraSathi', 'Images.xcassets', 'AppIcon.appiconset');

const ANDROID_SIZES = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192,
};

const IOS_SIZES = [
  { size: 20, scale: 2 },
  { size: 20, scale: 3 },
  { size: 29, scale: 2 },
  { size: 29, scale: 3 },
  { size: 40, scale: 2 },
  { size: 40, scale: 3 },
  { size: 60, scale: 2 },
  { size: 60, scale: 3 },
  { size: 1024, scale: 1, idiom: 'ios-marketing' },
];

async function generateIcons() {
  if (!fs.existsSync(SOURCE_IMAGE)) {
    console.error(`Source image ${SOURCE_IMAGE} not found!`);
    process.exit(1);
  }

  console.log('Generating Android icons...');
  for (const [folder, size] of Object.entries(ANDROID_SIZES)) {
    const targetFolder = path.join(ANDROID_RES_PATH, folder);
    
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    const launcherPath = path.join(targetFolder, 'ic_launcher.png');
    const launcherRoundPath = path.join(targetFolder, 'ic_launcher_round.png');

    await sharp(SOURCE_IMAGE).resize(size, size).toFile(launcherPath);
    await sharp(SOURCE_IMAGE).resize(size, size).toFile(launcherRoundPath);
      
    console.log(`Generated ${size}x${size} icon in ${folder}`);
  }
  
  console.log('\nGenerating iOS icons...');
  if (!fs.existsSync(IOS_ICON_PATH)) {
    fs.mkdirSync(IOS_ICON_PATH, { recursive: true });
  }

  const iosContents = {
    images: [],
    info: { author: "xcode", version: 1 }
  };

  for (const item of IOS_SIZES) {
    const { size, scale, idiom = 'iphone' } = item;
    const pixelSize = size * scale;
    const filename = `icon-${size}x${size}@${scale}x.png`;
    const targetPath = path.join(IOS_ICON_PATH, filename);

    await sharp(SOURCE_IMAGE).resize(pixelSize, pixelSize).toFile(targetPath);
    
    iosContents.images.push({
      size: `${size}x${size}`,
      idiom: idiom,
      filename: filename,
      scale: `${scale}x`
    });
    
    console.log(`Generated iOS icon ${filename} (${pixelSize}x${pixelSize})`);
  }

  fs.writeFileSync(
    path.join(IOS_ICON_PATH, 'Contents.json'),
    JSON.stringify(iosContents, null, 2)
  );

  console.log('\nApp icons generated successfully!');
}

generateIcons().catch(console.error);
