var express = require('express');
var router = express.Router();

var Post = require('../models/post');
var User = require('../models/user');
var moment = require('moment');

router.get('/:id', (req, res) => {
    var id = req.params.id;
    Post.findById(id, (err, post) => {
        res.status(err ? 400 : 200).send(err || post);
    }).populate('highiestUser');
});
router.put('/bit', User.isLoggedIn, (req, res) => {
    // console.log('bitInfo: ', req.body);
    var userId = req.body.userId;
    var bitVlue = req.body.bitVlue;
    var itemId = req.body.itemId;
    Post.findById(itemId, (err, post) => {
        // console.log('post before: ', post);
        if (err) return res.send(err);
        var valueOkay = (bitVlue > post.price);
        var whoIsBitter = ((userId).toString() !== (post.user[0]._id).toString());
        console.log(valueOkay, whoIsBitter);
        if (valueOkay && whoIsBitter) {
            post.price = Number(bitVlue);
            post.highiestUser.unshift(userId);
            post.save(err=>{
                if (err) return es.send(err);
                res.send(post);
            });
        }
        // console.log('post after: ', post);
    }).populate('highiestUser user');
});
module.exports = router;
