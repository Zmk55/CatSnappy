// Load mongoose package
const mongoose = require('mongoose');
const fs = require('fs');
var express = require('express');
var Schema = mongoose.Schema;

//img path
var imgPath = 'public/pics/cat1.jpg';

// Image schema
const schema = new mongoose.Schema({
  img: { data: Buffer, contentType: String },
  title: String,
  description: String,
  created_at: { type: Date, default: Date.now },
  deleted: {type: Boolean, default: false},
});

// our model
var Cat = mongoose.model('Cat', schema);

mongoose.connection.on('open', function () {
console.error('mongo is open');

// empty the collection
Cat.remove(function (err) {
  if (err) throw err;

  console.error('removed old docs');

  // store an img in binary in mongo
  var cat = new Cat;
  cat.img.data = fs.readFileSync(imgPath);
  cat.img.contentType = 'image/png';
  // cat.save(function (err, cat) {
  //   if (err) throw err;

  //   console.error('saved img to mongo');

  //    // start a demo server
  //    var server = express.createServer();
  //    server.get('/', function (req, res, next) {
  //      Cat.findById(cat, function (err, doc) {
  //        if (err) return next(err);
  //        res.contentType(doc.img.contentType);
  //        res.send(doc.img.data);
  //      });
  //    });

  //    server.on('close', function () {
  //     console.error('dropping db');
  //     mongoose.connection.db.dropDatabase(function () {
  //       console.error('closing db connection');
  //       mongoose.connection.close();
  //     });
  //   });

  //   server.listen(3333, function (err) {
  //     var address = server.address();
  //     console.error('server listening on http://%s:%d', address.address, address.port);
  //     console.error('press CTRL+C to exit');
  //   });

  //   process.on('SIGINT', function () {
  //     server.close();
  //   });
  // });
});

});

module.exports = Cat;