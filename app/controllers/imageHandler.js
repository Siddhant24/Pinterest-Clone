'use strict';

var Image = require('../models/image.js');
var User = require('../models/users.js');

module.exports = {

    newImage: function(data, user_id) {
        var newImage = new Image();

        newImage.owner = user_id;
        newImage.link = data.link;
        newImage.caption = data.caption;
        newImage.likes.push("596e47b370e9d54a0c0288c5");
        newImage.number = 0;
        //console.log(newImage);
        newImage.save(function(err) {
            if (err) {
                throw err;
            }
        });
    },

    findMyImages: function(user_id) {
        return new Promise(function(resolve, reject) {
            Image.find({
                owner: user_id
            }, function(err, docs) {
                if (err) console.error(err);
              //  console.log(docs);
                resolve(docs);
            });
        });
    },

    findAllImages: function() {
        return new Promise(function(resolve, reject) {
            Image.find().populate('owner').exec(function(err, docs) {
                if (err) console.error(err);
                resolve(docs);
            });
        });
    },

    deleteMyImage: function(image_id) {
        Image.findOneAndRemove({
            _id: image_id
        }, function(err, doc) {
            if (err) console.error(err);
            console.log(doc);
        });
    },

    addLike: async function(voter_id, image_id) {
        function hasLiked() {
            return new Promise(function(resolve, reject) {
                Image.find({
                    _id: image_id
                }, function(err, doc) {
                    if (err) console.error(err);
                    console.log(doc[0].likes);
                    console.log(voter_id);
                    doc[0].likes.every(function(id, index) {
                        if (JSON.stringify(id) === JSON.stringify(voter_id) && doc[0].number !== 0) {
                            console.log("resolved");
                            reject("found");
                            return false;
                        }
                        else if (index === doc[0].likes.length - 1) {
                            console.log("rejected");
                            resolve();
                        }
                        else {
                            return true;
                        }
                    });
                });
            });
        }
        try {
            await hasLiked();
            Image.findOneAndUpdate({
                _id: image_id
            }, {
                $push: {
                    likes: voter_id
                },
                $inc: {
                    number: 1
                }
            }, {
                new: true
            }, function(err, doc) {
                if (err) console.log(err);
                console.log(doc);
            });
            
            return "added like";
        }
        catch (msg) {
            console.log("catch..." + msg);
            Image.findOneAndUpdate({
                _id: image_id
            }, {
                $pull: {
                    likes: voter_id
                },
                $inc: {
                    number: -1
                }
            }, {
                new: true
            }, function(err, doc) {
                if (err) console.log(err);
                console.log(doc);
            });
            
            return "deleted like";
        }
    }
};
