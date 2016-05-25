var express = require('express');
var router = express.Router();

var Beer = require('../models/beer');
var User = require('../models/user');
var moment = require('moment');

router.get('/:id', (req, res) => {
    var id = req.params.id;
    beer.findById(id, (err, beer) => {
        res.status(err ? 400 : 200).send(err || beer);
    }).populate('highiestUser');
});
router.get('/randomone', (req, res) => {
    console.log('req one beer: ');



    Beer.findById(id, (err, beer) => {
        res.status(err ? 400 : 200).send(err || beer);
    }).populate('highiestUser');
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
            beer.save(err=>{
                if (err) return es.send(err);
                res.send(beer);
            });
        }
        // console.log('beer after: ', beer);
    }).populate('highiestUser user');
});
module.exports = router;
