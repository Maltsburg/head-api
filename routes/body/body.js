const express = require('express');
const {bodyBuilder} = require('./bodyBuilder');
const path = require('path');
const fs = require('fs');

const cacheDir = path.join(__dirname, '../../cache', 'body');

const router = express.Router();

router.get('/:username/:scale?/:style?', async (req, res) => {
    let {username, scale, style} = req.params;

    scale = scale ? Math.min(Math.max(parseInt(scale), 1), 64) : 16;

    const cacheFilePath = path.join(cacheDir, `${username}.${scale}.${style || 'default'}.png`);

    try {
        // Create the folder since it will be deleted on startup
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir);
        }

        // Check if the body is cached
        if (fs.existsSync(cacheFilePath)) {
            return res.sendFile(cacheFilePath);
        }

        const skinCanvas = await bodyBuilder(username, scale, style); // Create body
        const skin = skinCanvas.toBuffer('image/png');

        fs.writeFileSync(cacheFilePath, skin); // Cache it

        res.setHeader('Content-Type', 'image/png');
        res.end(skin); // Serve it
    } catch (error) {
        console.error('Error processing body:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

module.exports = router;