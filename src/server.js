// src/server.js
const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const fs = require('fs');
const multer = require('multer');
const app = express();
const publicPath = path.resolve(__dirname, '../public');
app.use(express.static(publicPath));

// mongoose.connection.openUri(`mongodb://${config.db.username}:${config.db.password}@${config.db.host}/${config.db.dbName}`);

// Import all models
require('./models/file.model.js');

app.listen(4949, function() {
  console.log(`SuperApp is listening on port ${4949}`);
});

// app.listen(config.port, function() {
//   console.log(`${config.appName} is listening on port ${config.port}`);
// });