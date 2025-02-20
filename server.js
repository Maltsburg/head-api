const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 2095;
const routesDir = path.join(__dirname, 'routes');
const cacheDir = path.join(routesDir, 'cache');
const head = require(path.join(routesDir, 'head.js'));

app.use(cors());
app.use(express.json());

// Delete the head cache folder
fs.rmSync(cacheDir, { recursive: true, force: true });

app.use('/head', head);

app.listen(port, () => console.log(`API running at http://localhost:${port}`));