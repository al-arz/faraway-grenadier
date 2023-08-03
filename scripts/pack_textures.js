const texturePacker = require("free-tex-packer-core");
const fs = require("fs")
const path = require("path");

const options = {
  textureName: "my-texture",
  fixedSize: false,
  padding: 1,
  allowRotation: false,
  detectIdentical: true,
  allowTrim: true,
  exporter: "Pixi",
  removeFileExtension: true,
  prependFolderName: false
};

const bundleSrcPath = "./assets_src/_pack/"
const bundles = [
  "ground",
  "nades",
  // "chars",
  "fx",
]

const outputPath = "./src/assets/"

bundles.forEach(b => packBundle(b))

function packBundle(name) {
  const images = []
  const bundlePath = bundleSrcPath + name + "/"
  const files = fs.readdirSync(bundlePath)
  console.log("Bundling ", bundlePath)
  console.log(files)
  for (const f of files) {
    const filePath = path.resolve(bundlePath, f)
    if (fs.existsSync(filePath) && !fs.statSync(filePath).isDirectory()) {
      images.push({ path: f, contents: fs.readFileSync(filePath) })
    }
  }

  options.textureName = name

  texturePacker(images, options, (files, error) => {
    if (error) {
      console.error('Packaging failed', error);
    } else {
      for (const item of files) {
        const out = path.resolve(outputPath + "/" + name + "/", item.name);
        console.log('Writing ' + out);
        if (item.name.includes(".json")) {
          const string = item.buffer.toString('utf-8')
          const minified = JSON.stringify(JSON.parse(string))
          console.log(minified)
          fs.writeFileSync(out, minified);
        } else {
          fs.writeFileSync(out, item.buffer);
        }
      }
    }
  });
}
