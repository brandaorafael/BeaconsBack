angular.module('relampago', ['LocalStorageModule'])

.controller("appController", ["$rootScope", function($rootScope){
	var appCtrl = this;

	$rootScope.viewFlag = 1;

}])

.directive('mensagem', ["$rootScope",
  function($rootScope) {
	  return {
	  	restrict: 'E',
	  	link: function($scope){
	  		var socket = io.connect('http://localhost:3000');
	  		// var socket = io.connect('http://relampagomaruinhos.localtunnel.me');

	  		var aux = 0;

	  		$scope.sendMessage = function(){
	  			socket.emit('mensagem', {nome: $rootScope.nome, msg: $scope.mensagem});
	  			$scope.mensagem = '';
	  		}

	  		socket.on('mensagem', function(msg){
	  			msg.msg = msg.msg.replace(/</g, "&lt;").replace(/>/g, "&gt;");
		        $('#messages').append($('<li>').html("<strong id='"+ aux + "'>" + msg.nome + '</strong>: ' + msg.msg));
		        $("#" + aux)[0].scrollIntoView();
		        aux++;
		    });
	  	},
	    templateUrl: 'view/mensagem.html'
	  };
	}
])

.directive('login', ["$rootScope",
  function($rootScope) {
	  return {
	  	restrict: 'E',
	  	link: function($scope){

	  		$scope.logar = function(){
	  			$rootScope.nome = $scope.nome;

	  			$rootScope.viewFlag = 2;
	  		}
	  	},
	    templateUrl: 'view/login.html'
	  };
	}
])