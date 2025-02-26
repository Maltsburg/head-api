const express = require('express');
const { skinBuilder } = require('./skinBuilder');
const path = require('path');
const fs = require('fs');

const cacheDir = path.join(__dirname, '../../cache', 'skins');

const router = express.Router();

router.get('/:username/:scale?', async (req, res) => {
    let { username, scale } = req.params;
    const { style } = req.query;

    scale = scale ? Math.min(Math.max(parseInt(scale), 1), 64) : 16;

    const cacheFilePath = path.join(cacheDir, `${username}.${scale}.${style || 'default'}.png`);

    try {
        // Create the folder since it will be deleted on startup
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir);
        }

        // Check if the skin is cached
        if (fs.existsSync(cacheFilePath)) {
            return res.sendFile(cacheFilePath);
        }

        const skinCanvas = await skinBuilder(username, scale, style); // Create skin
        const skin = skinCanvas.toBuffer('image/png');

        fs.writeFileSync(cacheFilePath, skin); // Cache it

        res.setHeader('Content-Type', 'image/png');
        res.end(skin); // Serve it
    } catch (error) {
        console.error('Error processing skin:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;