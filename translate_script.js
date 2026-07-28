import fs from "fs";
import path from "path";

const appFile = path.resolve("./src/App.tsx");
let content = fs.readFileSync(appFile, "utf-8");

// We only want to add {t("Text")} to visible strings!
// This is very risky over 9000 lines. Let's just create a custom translation function and manually do the largest UI words.
