const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 2095;
const routesDir = path.join(__dirname, 'routes');

const cacheDir = path.join(__dirname, './cache');
const head = require(path.join(routesDir, 'head/head.js'));
const body = require(path.join(routesDir, 'body/body.js'));
const torso = require(path.join(routesDir, 'torso/torso.js'));
const skin = require(path.join(routesDir, 'skin.js'));


app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'pages', "404")));

// Delete and create the head cache folder
fs.rmSync(cacheDir, { recursive: true, force: true });
fs.mkdirSync(cacheDir, { recursive: true });

app.use('/head', head);
app.use('/body', body);
app.use('/torso', torso);
app.use('/skin', skin);

app.use(express.static(path.join(__dirname, 'pages')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'home.html'));
});

// error page
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'pages', '404', '404.html'));
});

app.listen(port, () => console.log(`API running at http://localhost:${port}`));