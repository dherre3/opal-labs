ons.ready(function() {
  console.log("Onsen UI is ready!");
});
var app = angular.module('myApp', ['onsen']);
app.controller('AppController', function($scope) {
  var app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
  if (app) {
    var push = PushNotification.init({
      android: {
        senderID: "8995770603"
      },
      ios: {
        alert: "true",
        badge: "true",
        sound: "true"
      },
      windows: {}
    });

    push.on('registration', function(data) {
      // data.registrationId
      console.log(data);
    });

    push.on('notification', function(data) {
      // data.message,
      // data.title,
      // data.count,
      // data.sound,
      // data.image,
      // data.additionalData
      console.log(data);

    });

    push.on('error', function(e) {
      // e.message
      console.log(e);

    });
  }
});