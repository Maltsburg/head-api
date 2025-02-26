const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const cacheDir = path.join(__dirname, '../../cache', 'bust');
const { bustBuilder } = require('./bustBuilder');

router.get('/:username/:scale?', async (req, res) => {
    let { username, scale } = req.params;
    const { style } = req.query;

    scale = scale ? Math.min(Math.max(parseInt(scale), 4), 64) : 16;

    const cacheFilePath = path.join(cacheDir, `${username}.${scale}.${style || 'default'}.png`);

    try {

        // Create the folder since it will be deleted on startup
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir);
        }

        // Check if the head is cached
        if (fs.existsSync(cacheFilePath)) {
            return res.sendFile(cacheFilePath);
        }

        // If not cached, go through thr process
        const headCanvas = await bustBuilder(username, scale, style); // Create bust
        const head = headCanvas.toBuffer('image/png');

        fs.writeFileSync(cacheFilePath, head); // Cache it

        res.setHeader('Content-Type', 'image/png');
        res.end(head); // Serve it
    } catch (error) {
        console.error('Error processing skin:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;