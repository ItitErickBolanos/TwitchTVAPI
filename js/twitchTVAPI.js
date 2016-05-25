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

app.controller('twitchTVController', ['$scope', 'twitchAPI', function($scope, twitchAPI){
  $scope.streamers = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"],
  $scope.streamersData = [];
  $scope.selected = "all";

  for(var i = 0; i < $scope.streamers.length; i++){
    var streamer = $scope.streamers[i];

    twitchAPI.getStreamers(streamer)
    .success(function(data){
      var streamer_split = data["_links"].channel.split("/"),
          streamer_name = streamer_split[streamer_split.length - 1];
      $scope.streamersData[i] = data;
      twitchAPI.getChannelsData(streamer_name)
      .success(function(resp){
          $.extend($scope.streamersData[i], { "channelData" : resp });
          console.log($scope.streamersData);
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
