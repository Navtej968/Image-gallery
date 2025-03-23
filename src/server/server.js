import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import myscript from "./discordBot.js"

const app = express();
const PORT = 5000;

app.use(cors());

const filePath = path.join(process.cwd(), "src/server/images.txt");


app.get("/api/images", (req, res) => {
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Failed to read the file" });
        }
        const images = data
            .split("\n")
            .map(url => url.trim())
            .filter(url => url.length > 0 && url.startsWith("http"))
            .map((url, index) => ({ alt: `Image ${index + 1}`, src: url }));

        res.json(images);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    setInterval(()=> myscript(),60000);
});
