'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Image = new Schema({
   owner: { type: Schema.Types.ObjectId, ref: 'User' } ,
   link: String,
   caption: String,
   likes: [{type: Schema.Types.ObjectId, ref: 'User'}],
   number: Number
});

module.exports = mongoose.model('Image', Image);