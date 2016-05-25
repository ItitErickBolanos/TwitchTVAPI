var app = angular.module("TwitchStreamers", ['ngMaterial']);

app.factory("twitchAPI", ['$http', function($http){
  var twitchObj = {};

  twitchObj.getStreamers = function(streamer){
    return $http.jsonp('https://api.twitch.tv/kraken/streams/' + streamer + '?callback=JSON_CALLBACK');
  };

  twitchObj.getChannelsData = function(streamer){
    return $http.jsonp('https://api.twitch.tv/kraken/channels/' + streamer + '?callback=JSON_CALLBACK');
  }

  return twitchObj;
}]);

app.filter('orderObjectBy', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
});

app.controller('twitchTVController', ['$scope', 'twitchAPI', function($scope, twitchAPI){
  $scope.streamers = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"],
  $scope.streamersData = {};
  $scope.selected = "all";

  for(var i = 0; i < $scope.streamers.length; i++){
    streamer = $scope.streamers[i];

    twitchAPI.getStreamers(streamer)
    .success(function(data){
      var streamer_split = data["_links"].channel.split("/"),
          streamer_name = streamer_split[streamer_split.length - 1];
      $scope.streamersData[streamer_name] = [data];
      twitchAPI.getChannelsData(streamer_name)
      .success(function(resp){
          $scope.streamersData[streamer_name][1] = resp;
      })
      .error(function(error){
        console.log(error)
      })
    })
    .error(function(error){
      console.log(error);
    });
  }
}]);
