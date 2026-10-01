const fs = require("fs");
const path = require("path");

const distDir = path.join(__dirname, "dist");

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const filesToCopy = ["index.html", "style.css", "gioithieu.html"];

filesToCopy.forEach((file) => {
  const src = path.join(__dirname, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(distDir, file));
    console.log(`Copied: ${file}`);
  }
});

console.log("Build completed successfully!");
