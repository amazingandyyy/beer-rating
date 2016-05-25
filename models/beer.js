'use strict';

var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

var beerSchema = new mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    user:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

// beerSchema.statics.beer = function(beerDetails, cb) {
//     console.log('beerDetails: ', beerDetails);
//     this.create(beerDetails, (err, beer) => {
//         if (err) return cb(err);
//         cb(null, beer);
//     });
// };
// beerSchema.statics.liked = function(userId, beerId, cb) {
//     this.findById(beerId, (err, beer) => {
//         console.log('beer: ', beer);
//         var index = beer.likes.indexOf(userId);
//         console.log('index: ', index);
//         console.log('userId: ', typeof userId);
//         console.log('beer.likes: ', beer.likes);
//         if (index === -1) {
//             beer.likes.push(userId);
//         } else {
//             beer.likes.splice(index, 1);
//         }
//         beer.save((err) => {
//             cb(err)
//         });
//     });
// };


var Beer = mongoose.model('Beer', beerSchema);

module.exports = Beer;
