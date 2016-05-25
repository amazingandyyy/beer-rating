'use strict';

var app = angular.module('myApp');


app.service('Auth', function($http) {

    this.getProfile = () => {
        return $http({
            method: 'GET',
            url: '/api/users/profile/own'
        });
    }
    this.login = (userObj) => {
        return $http({
            method: 'POST',
            url: '/api/users/login',
            data: userObj
        });
    }
    this.register = (userObj) => {
        return $http({
            method: 'POST',
            url: '/api/users/register',
            data: userObj
        });
    }
    this.logout = () => {
        return $http({
            method: 'DELETE',
            url: '/api/users/logout'
        });
    }
});
app.service('User', function($http) {

    this.getProfileById = (userId) => {
        return $http({
            method: 'GET',
            url: `/api/users/profile/${userId}`
        });
    }
    this.editProfile = (userObj) => {
        return $http({
            method: 'PUT',
            url: '/api/users/profile/own',
            data: userObj
        });
    }
    this.getOne = (id) => {
        return $http({
            method: 'GET',
            url: `/api/users/${id}`
        });
    }
});

app.service('Beer', function($http) {
    this.getRandomBeer = (userId) => {
        return $http({
            method: 'GET',
            url: `/api/beer/randomone/${userId}`
        });
    }
    this.sampled = (userId, beerId, rate, comment) => {
        return $http({
            method: 'PUT',
            url: `/api/beer/sampled/${userId}/${beerId}/${rate}`,
            data: {
                comment: comment
            }
        });
    }
    this.unsampled = (userId, beerId) => {
        return $http({
            method: 'PUT',
            url: `/api/beer/unsampled/${userId}/${beerId}`
        });
    }
    this.getOne = (id) => {
        return $http({
            method: 'GET',
            url: `/api/beer/${id}`
        });
    }
});
