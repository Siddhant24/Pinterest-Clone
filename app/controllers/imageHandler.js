'use strict';

var Image = require('./models/image.js');
var User = require('./models/users.js');

module.exports = {

    newImage: function(data, user_id) {
        var newImage = new Image();

        newImage.owner = user_id;
        newImage.link = data.link;
        newImage.caption = data.caption;
        newImage.likes.push(user_id);
        newImage.number = 0;

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
                console.log(docs);
                resolve(docs);
            });
        });
    },

    findAllImages: function() {
        return new Promise(function(resolve, reject) {
            Image.find({}, function(err, docs) {
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

    addLike: function(voter_id, image_id) {
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
    }

};
