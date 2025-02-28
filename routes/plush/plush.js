const express = require('express');
const { plushBuilder } = require('./plushBuilder');
const path = require('path');
const fs = require('fs');

const cacheDir = path.join(__dirname, '../../cache', 'plush');

const router = express.Router();

router.get('/:username', async (req, res) => {
    let { username } = req.params;
    const { style } = req.query;


    const cacheFilePath = path.join(cacheDir, `${username}.${style || 'default'}.png`);

    try {
        // Create the folder since it will be deleted on startup
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir);
        }

        // Check if the plushie is cached
        if (fs.existsSync(cacheFilePath)) {
            return res.sendFile(cacheFilePath);
        }

        const skinCanvas = await plushBuilder(username, style); // Create plush
        const skin = skinCanvas.toBuffer('image/png');

        fs.writeFileSync(cacheFilePath, skin); // Cache it

        res.setHeader('Content-Type', 'image/png');
        res.end(skin); // Serve it
    } catch (error) {
        console.error('Error processing plushie:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;