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
app.controller('homeCtrl', function($http, $scope, Auth) {
    console.log('homeCtrl loaded');
    // $scope.logMsg.err = '';

    Auth.getProfile().then(function(res) {
        console.log(res);
        $scope.currentUser = res.data;
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
        console.log(res);
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
        }, function(err) {
            console.log('Cannot get one beer!');
        })
    }





});

// app.controller('itemCtrl', function($http, $scope, $stateParams, User, Post) {
//     console.log('itemCtrl loaded');
//     console.log($stateParams);
//     console.log($stateParams.id);
//     Post.getOne($stateParams.id).then(function(res) {
//         console.log(res);
//         $scope.post = res.data;
//     }, function(err) {
//         console.log('user is not logged in.');
//     })
//     $scope.bitForm = (id) => {
//         var userId = $scope.currentUser._id;
//         var bitVlue = Number($scope.post.price) + Number($scope.addValue);
//         var itemId = id;
//         Post.bitted(userId, bitVlue, itemId).then(function(res) {
//             console.log(res);
//             $scope.post.price = res.data.price;
//             $scope.addValue = null;
//         }, function(err) {
//             console.log('user is not logged in.');
//         })
//     }
//     $scope.timeLeft = () => {
//
//     }
// });
