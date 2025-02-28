const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 2095;
const routesDir = path.join(__dirname, 'routes');

const cacheDir = path.join(__dirname, './cache');
const head = require(path.join(routesDir, 'head/head.js'));
const skin = require(path.join(routesDir, 'body/body.js'));
const bust = require(path.join(routesDir, 'bust/bust.js'));
const plush = require(path.join(routesDir, 'plush/plush.js'));

app.use(cors());
app.use(express.json());

// Delete and create the head cache folder
fs.rmSync(cacheDir, { recursive: true, force: true });
fs.mkdirSync(cacheDir, { recursive: true });

app.use('/head', head);
app.use('/body', skin);
app.use('/bust', bust);
app.use('/plush', plush)

app.listen(port, () => console.log(`API running at http://localhost:${port}`));