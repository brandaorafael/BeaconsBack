angular.module('beacons', ['LocalStorageModule'])

.controller("appController", ["$rootScope", function($rootScope){
	var appCtrl = this;

	// $rootScope.api = process.env.NOW_URL;

}])

.directive('beacons', ["$rootScope", "$http",
      function($rootScope, $http) {
            return {
      	  	restrict: 'E',
      	  	link: function($scope){

                        $scope.beacons = [];

      	  		var getBeaconName = function(beaconId){

                        	switch(beaconId) {
                        		case '08c7f93ee9697c35749f46413b764712':
                        			return "Mint"
                        			break;
                        		case '246d7ead60b351d458d3c4c0887e3a14':
                        			return "Blueberry"
                        			break;
                        		case 'ed74e21beab9d41e5ee96f54e9d6be2b':
                        			return "Ice"
                        			break;
                        		case '0ae1cb5c7677108ec9085f4435085e1d':
                        			return "Candy 1"
                        			break;
                        		case '0b080cb305bde1b8c504ea1ef2e4fb3c':
                        			return "Beetroot 1"
                        			break;
                        		case '6639d16f2532af31ec99ecf23a3d0b18':
                        			return "Beetroot 2"
                        			break;
                        		case '6eeb5a738541d4e99a7cd9dd7acab539':
                        			return "Lemon 1"
                        			break;
                        		case 'c626263f8573361887f2885363964c1a':
                        			return "Candy 2"
                        			break;
                        		case 'fa30d761ceca937891b3c0bdf7fbf910':
                        			return "Lemon 2"
                        			break;
                				default:
                    				return '??????'
            			}
                        }

                        $http.get('/env')
                        .success(function(data){

                              console.log(data);

                              var socket = io.connect(data.url);

                              socket.on('beacon', function(beacon){

                                    if ($scope.beacons.filter(function(e) {return e.cellId == beacon.cellId}).length == 0) {
                                          $scope.beacons.push({"cellId": beacon.cellId ,"beaconId": beacon.beaconId, "beaconName": getBeaconName(beacon.beaconId)});
                                    } else {

                                          var index = $scope.beacons.map(function(e) { return e.cellId; }).indexOf(beacon.cellId);

                                          console.log(index);

                                          $scope.beacons[index] = {"cellId": beacon.cellId ,"beaconId": beacon.beaconId, "beaconName": getBeaconName(beacon.beaconId)};
                                    }

                                    $scope.$apply();

                              })
                        })

                        // $http.get($rootScope.api + 'beacons')
                        $http.get('/beacons')
                        .success(function(data){
                              

                              console.log(data);

                              for(i = 0; i < data.length; i++){
                                    $scope.beacons.push({"cellId": data[i].cellId ,"beaconId": data[i].beaconId, "beaconName": getBeaconName(data[i].beaconId)});
                              }

                        })
                  },

      	     templateUrl: 'view/beacons.html'

      	};
	}
])