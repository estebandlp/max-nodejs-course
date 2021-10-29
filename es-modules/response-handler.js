import fs from "fs/promises";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const resHandler = (req, res, next) => {
  fs.readFile("my-page.html", "utf8").then((err, data) => {
    res.send(data);
  });

  //res.sendFile(path.join(__dirname, "my-page.html"));
};

export default resHandler;
