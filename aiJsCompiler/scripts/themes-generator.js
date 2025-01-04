import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const themesDir = path.join(__dirname, "../public/themes");
const outputFile = path.join(themesDir, "index.json");


fs.readdir(themesDir, (err, files) => {
  if (err) {
    console.error("Error reading themes directory:", err);
    return;
  }

  
  const themeFiles = files.filter(
    (file) => file.endsWith(".json") && file !== "index.json"
  );

 
  fs.writeFileSync(outputFile, JSON.stringify(themeFiles, null, 2));
  console.log(`Generated theme index with ${themeFiles.length} themes`);
});
