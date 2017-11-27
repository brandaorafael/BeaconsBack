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

      	  		var getBeacon = function(beaconId){

                        	switch(beaconId) {
                        		case '08c7f93ee9697c35749f46413b764712':
                        			return {color: "Mint", location: "Entrada"}
                        			break;
                        		case '246d7ead60b351d458d3c4c0887e3a14':
                        			return {color: "Blueberry", location: "Varanda"}
                        			break;
                        		case 'ed74e21beab9d41e5ee96f54e9d6be2b':
                        			return {color: "Ice", location: "Corredor"}
                        			break;
                        		case '0ae1cb5c7677108ec9085f4435085e1d':
                        			return {color: "Candy 1", location: "Banheiro Suíte"}
                        			break;
                        		case '0b080cb305bde1b8c504ea1ef2e4fb3c':
                        			return {color: "Beetroot 1", location: "Escritorio"}
                        			break;
                        		case '6639d16f2532af31ec99ecf23a3d0b18':
                        			return {color: "Beetroot 2", location: "Suíte"}
                        			break;
                        		case '6eeb5a738541d4e99a7cd9dd7acab539':
                        			return {color: "Lemon 1", location: "Cozinha"}
                        			break;
                        		case 'c626263f8573361887f2885363964c1a':
                        			return {color: "Candy 2", location: "Banheiro"}
                        			break;
                        		case 'fa30d761ceca937891b3c0bdf7fbf910':
                        			return {color: "Lemon 2", location: "Sala"}
                        			break;
                				default:
                    				return {color: "??????", location: "??????"}
            			}
                        }

                        var getPhone = function(udid){

                              switch(udid) {
                                    case 'cd2781c8a7fb8f0a':
                                          return 'HTC'
                                          break;
                                    case '3d9ed7a09efc0901':
                                          return 'MOTO G'
                                          break;
                                    default:
                                          return udid
                              }
                        }

                        var riskAreaBeaconIds = [
                              '246d7ead60b351d458d3c4c0887e3a14',
                              '6eeb5a738541d4e99a7cd9dd7acab539'
                        ];

                        $scope.isRiskArea = function(beaconId){
                              return riskAreaBeaconIds.includes(beaconId);
                        }

                        $scope.riskAreasBeacons = [];

                        $http.get('/env')
                        .success(function(data){

                              var socket = io.connect(data.url);

                              socket.on('beacon', function(beacon){

                                    var beaconObject = getBeacon(beacon.beaconId);

                                    var beaconHTML = {"cellId":beacon.cellId, "device": getPhone(beacon.cellId) ,"beaconName": beaconObject.color, "beaconLocation": beaconObject.location, "beaconId": beacon.beaconId};

                                    if ($scope.beacons.filter(function(e) {return e.cellId == beacon.cellId}).length == 0) {
                                          $scope.beacons.push(beaconHTML);
                                    } else {

                                          var index = $scope.beacons.map(function(e) { return e.cellId; }).indexOf(beacon.cellId);

                                          $scope.beacons[index] = beaconHTML;
                                    }

                                    prepareModal();

                                    $scope.$apply();

                              })
                        })

                        // $http.get($rootScope.api + 'beacons')
                        $http.get('/beacons')
                        .success(function(data){

                              for(i = 0; i < data.length; i++){

                                    var beaconObject = getBeacon(data[i].beaconId);

                                    var beaconHTML = {"cellId":data[i].cellId, "device": getPhone(data[i].cellId) ,"beaconName": beaconObject.color, "beaconLocation": beaconObject.location, "beaconId": data[i].beaconId};

                                    $scope.beacons.push(beaconHTML);

                                    prepareModal();
                              }

                        })

                        $scope.showModal = function(){

                              $('#myModal').modal('show');

                        }

                        var prepareModal = function(){

                              var aux = $scope.beacons.filter(e => $scope.isRiskArea(e.beaconId));

                              if($scope.riskAreasBeacons.length == 0 && aux.length > 0){
                                    $scope.riskAreasBeacons = aux;

                                    $('#myModal').modal('show');
                              }

                              if(aux.length == 0){
                                    $scope.riskAreasBeacons = [];

                                    $('#myModal').modal('hide');
                              } else if(aux.length > $scope.riskAreasBeacons.length){
                                    $scope.riskAreasBeacons = aux;
                                    $('#myModal').modal('show');
                              } else if(aux.length < $scope.riskAreasBeacons.length) {
                                    $scope.riskAreasBeacons = aux;
                              }

                        }
                  },

      	     templateUrl: 'view/beacons.html'

      	};
	}
])