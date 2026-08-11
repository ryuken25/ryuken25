// One-off: optimize the portrait for the web (resize, gentle lift, webp + jpg).
// Run from the portfolio/ dir. Not part of the app build.
import sharp from "sharp";

const SRC = "../wow.png"; // D:\CodePaid\malay\wow.png relative to portfolio/

const base = () =>
  sharp(SRC)
    .resize({ width: 760, withoutEnlargement: true })
    .modulate({ brightness: 1.07 }) // portrait is a touch underexposed
    .sharpen();

const jpgInfo = await base()
  .jpeg({ quality: 82, mozjpeg: true, progressive: true })
  .toFile("public/arya.jpg");

const webpInfo = await base().webp({ quality: 80 }).toFile("public/arya.webp");

console.log(
  `jpg ${jpgInfo.width}x${jpgInfo.height} ${jpgInfo.size}B | webp ${webpInfo.size}B`,
);
