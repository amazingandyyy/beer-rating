var express = require('express');
var router = express.Router();

var request = require('request');
var Beer = require('../models/beer');
var User = require('../models/user');
var moment = require('moment');

router.get('/', (req, res) => {
    Beer.find({}, (err, beers) => {
        res.status(err ? 400 : 200).send(err || beers)
    })
});
router.get('/:id', (req, res) => {
    var beerId = req.params.id;
    Beer.findById(beerId, (err, beer) => {
        res.status(err ? 400 : 200).send(err || beer)
    })
});
router.delete('/', (req, res) => {
    Beer.remove({}, (err) => {
        res.status(err ? 400 : 200).send(err)
    })
});
router.delete('/:id', (req, res) => {
    console.log('delete beerId: ', beerId);
    var beerId = req.params.id;
    Beer.findByIdAndRemove(beerId, (err) => {
        res.status(err ? 400 : 200).send(err)
    })
});
router.get('/randomone/:userId', (req, res) => {
    // console.log('req one beer');
    var userId = req.params.userId;


    request(`http://api.brewerydb.com/v2/beer/random/?key=${process.env.BRW_KEY}`, (err, response) => {
        if (err) return res.status(400).send(err);
        // console.log('data: ', JSON.parse(res.body).data);
        var beerData = JSON.parse(response.body).data;
        var beerObj = {
                beerInfo: beerData
            }
            // console.log('userId: ', req.params.userId);
        Beer.create(beerObj, (err, beer) => {
            if (err) return res.send(err);
            // console.log('beer: ', beer);

            beer.user.push(userId);
            beer.save();
            // console.log('beer._id: ', beer._id);
            if (beer._id) {
                User.findById(userId, (err, user) => {
                    if (err || !user) return res.status(400).send(err || 'no user found');
                    // console.log('user: ', user);
                    user.allbeer.push(beer._id);
                    user.save();
                    res.send(beer);
                })
            }
        });
    })
});
router.put('/sampled/:userId/:beerId/:rate', (req, res) => {
    // console.log('req one beer');
    var userId = req.params.userId;
    var beerId = req.params.beerId;
    var rate = req.params.rate;
    var comment = req.body.comment;
    // console.log('userId: ', userId);
    // console.log('beerId: ', beerId);
    console.log('comment: ', comment);
    console.log('userId: ', userId);

    User.findById(userId)
        .exec((err, user) => {
            if (err || !user) return res.status(400).send(err || 'no user found');
            if (user.unsampled.indexOf(`${beerId}`) !== -1) {
                console.log('it was in unsampled before');
                var index = user.unsampled.indexOf(beerId);
                user.unsampled.splice(index, 1);
                user.save();
            }else{
                user.sampled.push(beerId);
                user.save();
                Beer.findById(beerId, (err, beer) => {
                    if (err || !beer) return res.status(400).send(err || 'no beer found');
                    beer.rate = rate;
                    beer.comment = comment;
                    if (beer.user.indexOf(userId) == -1) {
                        beer.user.push(userId)
                    }
                    beer.save();
                })
            }
            res.send(user);
        })
});
router.put('/unsampled/:userId/:beerId', (req, res) => {
    // console.log('req one beer');
    var userId = req.params.userId;
    var beerId = req.params.beerId;

    User.findById(userId, (err, user) => {
        if (err || !user) return res.status(400).send(err || 'no user found');
        var hasBeerAsSampled = user.sampled.indexOf(beerId) !== -1;
        var hasBeerAsUnsampled = user.sampled.indexOf(beerId) !== -1;
        if (hasBeerAsSampled || hasBeerAsUnsampled) {
            res.send(user);
        } else {
            if(user.unsampled.indexOf(beerId)==-1){
                user.unsampled.push(beerId);
            }
            user.save();
        }
        res.send(user);
    })
});


router.put('/bit', User.isLoggedIn, (req, res) => {
    // console.log('bitInfo: ', req.body);
    var userId = req.body.userId;
    var bitVlue = req.body.bitVlue;
    var itemId = req.body.itemId;
    Beer.findById(itemId, (err, beer) => {
        // console.log('beer before: ', beer);
        if (err) return res.send(err);
        var valueOkay = (bitVlue > beer.price);
        var whoIsBitter = ((userId).toString() !== (beer.user[0]._id).toString());
        console.log(valueOkay, whoIsBitter);
        if (valueOkay && whoIsBitter) {
            beer.price = Number(bitVlue);
            beer.highiestUser.unshift(userId);
            beer.save(err => {
                if (err) return es.send(err);
                res.send(beer);
            });
        }
        // console.log('beer after: ', beer);
    }).populate('highiestUser user');
});
module.exports = router;
