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

                        //$scope variables
                        $scope.beacons = [];

                        $scope.riskAreasBeacons = [];


                        //local variables
                        var devices = [];

                        var locations = [];


                        //$http requests
                        $http.get('/env')
                        .success(function(data){
                              $http.get('/devices')
                              .success(function(dataDevices){
                                    $http.get('/locations')
                                    .success(function(dataLocations){

                                          locations = dataLocations;

                                          devices = dataDevices;

                                          var socket = io.connect(data.url);

                                          socket.on('beacon', function(beacon){

                                                var beaconObject = getBeacon(beacon.beaconId);

                                                var beaconHTML = {
                                                      "cellId":beacon.cellId, 
                                                      "device": getPhone(beacon.cellId) ,
                                                      "beaconName": beaconObject.name, 
                                                      "beaconLocation": beaconObject.location, 
                                                      "beaconId": beacon.beaconId,
                                                      "isRiskArea": beaconObject.isRiskArea
                                                };

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
                              })
                        })

                        $http.get('/beacons')
                        .success(function(dataBeacons){
                              $http.get('/devices')
                              .success(function(dataDevices){
                                    $http.get('/locations')
                                    .success(function(dataLocations){

                                          locations = dataLocations;

                                          devices = dataDevices;
                              
                                          for(i = 0; i < dataBeacons.length; i++){

                                                var beaconObject = getBeacon(dataBeacons[i].beaconId);

                                                var beaconHTML = {
                                                      "cellId":dataBeacons[i].cellId, 
                                                      "device": getPhone(dataBeacons[i].cellId) ,
                                                      "beaconName": beaconObject.name, 
                                                      "beaconLocation": beaconObject.location, 
                                                      "beaconId": dataBeacons[i].beaconId,
                                                      "isRiskArea": beaconObject.isRiskArea
                                                };

                                                $scope.beacons.push(beaconHTML);

                                                prepareModal();
                                          }

                                    })
                              })   
                        })

                        //Local functions
                        var getPhone = function(udid){

                              var device = devices
                              .filter(e => e.udid == udid);

                              return device.length > 0 ? device[0].device: udid;
                        }

                        var getBeacon = function(beaconId){

                              var beacon = locations
                              .filter(e => e.beaconId == beaconId);

                              return beacon.length > 0 ? beacon[0]: beaconId;
                        }

                        var prepareModal = function(){

                              var aux = $scope.beacons.filter(e => e.isRiskArea);

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



                        //$scope functions
                        $scope.showModal = function(){

                              $('#myModal').modal('show');
                        }
                            
                  },

      	     templateUrl: 'view/beacons.html'

      	};
	}
])