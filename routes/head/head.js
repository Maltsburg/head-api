const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const cacheDir = path.join(__dirname, '../../cache', 'heads');
const {headBuilder} = require('./headBuilder');

const headGrabber = path.join(__dirname, '../../pages/headgrabber');

router.use(express.static(headGrabber));

router.get('/', (req, res) => {
    res.sendFile(path.join(headGrabber, 'head.html'));
});

router.get('/:username/:size?/:style?', async (req, res) => {
    let {username, size, style} = req.params;

    size = size ? Math.min(Math.max(parseInt(size), 8), 512) : 32;

    const cacheFilePath = path.join(cacheDir, `${username}.${size}.${style || 'default'}.png`);

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
        const headCanvas = await headBuilder(username, size, style); // Create head
        const head = headCanvas.toBuffer('image/png');

        fs.writeFileSync(cacheFilePath, head); // Cache it

        res.setHeader('Content-Type', 'image/png');
        res.end(head); // Serve it
    } catch (error) {
        console.error('Error processing body:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

module.exports = router;