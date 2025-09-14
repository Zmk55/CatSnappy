// Load mongoose package
const mongoose = require('mongoose')
const fs = require('fs')
const express = require('express')
const Schema = mongoose.Schema

//img path

const path = require('path')
const imgPath = path.resolve(__dirname, '../../public/pics/cat1.jpg')

// Image schema
const schema = new mongoose.Schema({
  img: { data: Buffer, contentType: String },
  title: String,
  description: String,
  created_at: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false },
})

// our model
const Cat = mongoose.model('Cat', schema)

mongoose.connection.on('open', function () {
  console.error('mongo is open')

  // empty the collection
  Cat.remove(function (err) {
    if (err) throw err

    console.error('removed old docs!')

    // store an img in binary in mongo
    const cat = new Cat()
    cat.img.data = fs.readFileSync(imgPath)
    cat.img.contentType = 'image/png'
    cat.save(function (err, cat) {
      if (err) throw err

      console.error('saved img to mongo')
    })
  })
})

module.exports = Cat
