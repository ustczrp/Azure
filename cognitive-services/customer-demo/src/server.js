var express = require('express');
var router = require('./router.js');
var path = require('path');

const app = express();
var bodyParser = require('body-parser');
// parse various different custom JSON types as JSON
app.use(bodyParser.json({ type: 'application/json' }))

// parse some custom thing into a Buffer
app.use(bodyParser.raw({ type: 'application/octet-stream', limit: '10mb',inflate: true }))

// parse an HTML body into a string
app.use(bodyParser.text({ type: 'text/html' }))

app.use('/', express.static(path.join(__dirname, '../www')))

app.use('/node_modules', express.static(path.join(__dirname, '../node_modules')))
app.use('/api', router);


module.exports = app;

