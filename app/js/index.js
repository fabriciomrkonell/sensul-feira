'use strict';

const config = {
	eventMQTTName: 'automation',
	onStatus: 1,
	offStatus: 2,
	ventiladorMAC: '3',
	bombaMAC: '2',
	iluminacaoMAC: '1',
	sensorMAC: '0'
};

var socket = io();

angular.module('app', []);

angular.module('app').controller('ctrl', ['$scope', function($scope) {

	function refresh(){
		if (!$scope.$$phase) {
    	$scope.$apply();
		}
	};

	angular.extend($scope, {
		config: config,
		atuator: {},
		sensor: {
			t: 0,
			h: 0,
			p: 0
		}
	});

	$scope.atuator[config.ventiladorMAC] = config.offStatus;
	$scope.atuator[config.bombaMAC] = config.offStatus;
	$scope.atuator[config.iluminacaoMAC] = config.offStatus;

	socket.on(config.eventMQTTName, function(data){
    var mac = data.mac.toString();
		switch(mac) {
	    case config.sensorMAC:
	    	angular.extend($scope.sensor, {
					t: data.t,
					h: data.h,
					p: data.p
				});
	      break;
	    default:
        $scope.atuator[mac] = parseInt(data.value);
		}
		refresh()
  });

  $scope.itsOn = function(mac){
  	return $scope.atuator[mac] === config.onStatus;
  };

  $scope.onAtuadorClick = function(mac, value){
  	socket.emit(config.eventMQTTName, mac + ',' + value);
  	$scope.atuator[mac] = parseInt(value);
  	refresh();
  };

}]);

angular.element(document).ready(function() {
	angular.bootstrap(document, ['app']);
});
