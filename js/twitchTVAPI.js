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
  $scope.streamers = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "brunofin", "comster404"],
  $scope.streamersData = [];
  $scope.filterList = { selected : "all" };

  for(var i = 0; i < $scope.streamers.length; i++){
    var streamer = $scope.streamers[i];

    twitchAPI.getStreamers(streamer)
    .success(function(data){
      if (data.error == undefined) {
        var streamer_split = data["_links"].channel.split("/"),
            streamer_name = streamer_split[streamer_split.length - 1];
        $scope.streamersData.push(data);
        twitchAPI.getChannelsData(streamer_name)
        .success(function(resp){
            $.extend($scope.streamersData[$scope.streamersData.indexOf(data)], resp);
            $.extend($scope.streamersData[$scope.streamersData.indexOf(data)], { online: data.stream != null ? "online" : "offline" });
        })
        .error(function(error){
          console.log(error)
        });
      } else {
        var streamer_split = data.message.split("'");
            streamer_name = streamer_split[1];

        $scope.streamersData.push({
          name: streamer_name,
          online: "offline",
          url: "https://twitch.tv/" + streamer,
          logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Question_mark_(black_on_white).png",
          stream: "closed"
        });
      }
    })
    .error(function(error){
      console.log(error);
    });
  }
}]);
