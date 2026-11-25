// shared settings for the browser tests
const path = require('path'), fs = require('fs');
const URL = (process.env.CHEMTRACE_URL || 'http://localhost:8765').replace(/\/$/, '');
const OUT = path.join(__dirname, 'out'); fs.mkdirSync(OUT, {recursive: true});
module.exports = {URL, OUT, METALS: ["As", "Hg", "Pb", "Cd", "Cu", "Zn", "Ni", "Cr"]};
