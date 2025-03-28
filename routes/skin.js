const express = require('express');
const {createCanvas, loadImage} = require('canvas');
const path = require('path');
const fs = require('fs');
const {getSkinURL} = require("./util/getSkinURL");

const cacheDir = path.join(__dirname, '../cache', 'skins');

const router = express.Router();

router.get('/:username*', async (req, res) => {
    let {username} = req.params;

    const cacheFilePath = path.join(cacheDir, `${username}.png`);

    try {
        // Create the folder since it will be deleted on startup
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir);
        }

        // Check if the skin is cached
        if (fs.existsSync(cacheFilePath)) {
            return res.sendFile(cacheFilePath);
        }

        const skinData = await getSkinURL(username)
        const img = await loadImage(skinData.url);

        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(img, 0, 0);

        const skin = canvas.toBuffer('image/png');

        fs.writeFileSync(cacheFilePath, skin); // Cache it

        res.setHeader('Content-Type', 'image/png');
        res.end(skin); // Serve it
    } catch (error) {
        console.error('Error processing body:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

module.exports = router;