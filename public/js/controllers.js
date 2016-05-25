'use strict';

var app = angular.module('myApp');


app.controller('mainCtrl', function($http, $scope, Auth, $state) {
    console.log('mainCtrl loaded');
    Auth.getProfile().then(function(res) {
        console.log(res);
        $scope.currentUser = res.data;
        // rootCtrl's scope is basically $rootScope
        console.log('user is logged in.');
    }, function(err) {
        console.log('user is not logged in.');
    })

    $scope.logIn = (loginInfo) => {
        Auth.login(loginInfo)
            .then(function(res) {
                $scope.currentUser = res.data;
                $scope.loginInfo = null;
            }, function(err) {
                console.log('err: ', err);
            })
    }
    $scope.logOut = () => {
        console.log('Out');
        Auth.logout()
            .then(function(res) {
                $scope.currentUser = null;
                $scope.loginInfo = null;
                $state.go('home');
            }, function(err) {
                console.log('err: ', err);
            })
    }
    $scope.signUp = (newUser) => {
        console.log('create');
        console.log(newUser);
        Auth.register(newUser)
            .then(function(res) {
                console.log(res);
                $scope.newUser = null;
                $scope.logIn(newUser);
                $state.go('home');
            }, function(err) {
                console.log('err: ', err);

            })
    }
});
app.controller('homeCtrl', function($http, $scope, Auth, User) {
    console.log('homeCtrl loaded');
    // $scope.logMsg.err = '';

    Auth.getProfile().then(function(res) {
        console.log(res);
        $scope.currentUser = res.data;

        User.getProfileById(res.data._id).then(res=>{
            console.log('res.data: ', res.data);
            $scope.sampled = res.data.sampled;
            $scope.unsampled = res.data.unsampled;
        })

        //
        // console.log('currentId: ', res.data);


    }, function(err) {
        console.log('user is not logged in.');
    });


});
app.controller('communityCtrl', function($http, $scope, Auth) {
    console.log('communityCtrl loaded');
    $http.get('/api/users').then(function(res) {
        $scope.users = res.data;
    }, function(err) {
        console.log('users are not found.');
    });
});
app.controller('profileCtrl', function($http, User, $scope, $stateParams) {
    console.log('profileCtrl loaded');
    console.log($stateParams.userId);
    User.getProfileById($stateParams.userId).then(function(res) {
        console.log(res.data);
        $scope.user = res.data;
    }, function(err) {
        console.log('user are not found.');
    });
});
app.controller('profileSettingCtrl', function($http, $scope, Auth, User) {
    console.log('profileCtrl loaded');
    console.log($scope.currentUser);
    Auth.getProfile().then(function(res) {
        console.log('currentUser:' , res);
        $scope.currentUser = res.data;
        $scope.settingProfile = angular.copy($scope.currentUser);
    }, function(err) {
        console.log('user is not logged in.');
    })

    $scope.settingProfileSubmitted = () => {
        console.log($scope.settingProfile);
        User.editProfile($scope.settingProfile).then(function(res) {
            $scope.currentUser = $scope.settingProfile;
        }, function(err) {
            console.log('user is not logged in.');
        })
    }
});
app.controller('wallCtrl', function($http, $scope, Auth, Beer) {
    console.log('wallCtrl loaded');


    $scope.getRandomBeer = () => {

        // console.log('$scope.currentUser: ', );
        Beer.getRandomBeer($scope.currentUser._id).then(function(res) {
            console.log('res: ', res.data);
            $scope.beer = res.data;
            $scope.beer.name = res.data.beerInfo.name;
            $scope.beer.description = res.data.beerInfo.style.description;
            $scope.showratingForm = false;
            $scope.showAddWishList = false;
        }, function(err) {
            console.log('Cannot get one beer!');
        })
    }
    $scope.sampled = (beerId) => {
        var userId = $scope.currentUser._id;
        var rate = $scope.rate;
        var comment = $scope.comment;
        console.log(rate,comment);
        Beer.sampled(userId, beerId, rate, comment).then(function(res) {
            console.log('res: ', res.data);
            // $scope.beer = res.data;
            // $scope.beer.name = res.data.beerInfo.name;
            // $scope.beer.description = res.data.beerInfo.style.description;
        }, function(err) {
            console.log('Cannot get one beer!');
        })
    }
    $scope.unsampled = (beerId) => {
        var userId = $scope.currentUser._id
        console.log(userId, ' unsampled ', beerId);
        Beer.unsampled(userId, beerId).then(function(res) {
            console.log('res: ', res.data);
            // $scope.beer = res.data;
            // $scope.beer.name = res.data.beerInfo.name;
            // $scope.beer.description = res.data.beerInfo.style.description;
        }, function(err) {
            console.log('Cannot get one beer!');
        })
    }





});

app.controller('itemCtrl', function($http, $scope, $stateParams, User, Beer) {
    console.log('itemCtrl loaded');
    console.log($stateParams);
    console.log($stateParams.id);
    // Beer.getOne($stateParams.id).then(function(res) {
    //     console.log(res);
    //     $scope.beer = res.data;
    // }, function(err) {
    //     console.log('user is not logged in.');
    // })
});
