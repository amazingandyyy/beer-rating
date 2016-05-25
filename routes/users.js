var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Beer = require('../models/beer');
var moment = require('moment');

router.get('/', (req, res) => {
    User.find({}, (err, users) => {
        res.status(err ? 400 : 200).send(err || users);
    }).populate('sampled unsampled');
});
router.get('/beers', (req, res) => {
    beer.find({}, (err, beers) => {
        res.status(err ? 400 : 200).send(err || beers);
    }).populate('user');
});

//   /api/users/register
router.post('/register', (req, res) => {
    console.log(req.body);
    User.register(req.body, err => {
        res.status(err ? 400 : 200).send(err);
    });
});
router.post('/:id/beer', (req, res) => {
    var userId = req.params.id;
    var beerObj = req.body;
    // console.log('beerObj: ', req.body);
    // console.log('user: ', req.params);
    var deadline = moment();
    var deadlineM = deadline.valueOf(beerObj.deadline);
    console.log('deadlineM: ', deadlineM);
    var beerDetails = {
        user: userId,
        name: beerObj.name,
        description: beerObj.description,
        image: beerObj.image,
        price: beerObj.price,
        deadline: deadlineM
    }
    console.log('beerDetails: ', beerDetails);
    beer.beer(beerDetails, (err, beerDetails)  => {
        res.status(err ? 400 : 200).send(err || beerDetails);
    });
});
router.put('/:userId/like/:beerId', (req, res) => {
    var userId = req.params.userId;
    var beerId = req.params.beerId;
    console.log('userId: ', userId);
    console.log('beerId: ', beerId);
    beer.liked(userId, beerId, err => {
        res.status(err ? 400 : 200).send(err);
    });
});

router.post('/login', (req, res) => {
    console.log(req.body);
    User.authenticate(req.body, (err, data) => {
        if (err) return res.status(400).send(err);
        res.cookie('accessToken', data.token).send(data.dbUser);
    });
});

router.delete('/logout', (req, res) => {
    res.clearCookie('accessToken').send();
});

// /api/users/profile
router.get('/profile/own', User.isLoggedIn, (req, res) => {
    console.log('req.user:', req.user);
    res.send(req.user);
})
router.put('/profile/own', User.isLoggedIn, (req, res) => {
    console.log('req.body: ', req.body);
    var userObj = req.body
    User.findByIdAndUpdate(userObj._id, userObj)
        .exec((err, user) => {
            res.status(err ? 400 : 200).send(err || user);
        });
})

router.get('/profile/:id', (req, res) => {
    // console.log('ddd');
    console.log('req: ', req.params);
    var userId = req.params.id;
    console.log(userId);
    User.findById(userId)
        .populate('sampled')
        .populate('unsampled')
        .exec((err, user) => {
            res.status(err ? 400 : 200).send(err || user);
        });
})

module.exports = router;
