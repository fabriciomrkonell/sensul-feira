'use strict';

const config = {
	eventMQTTName: 'automation',
	onStatus: 1,
	offStatus: 2,
	address: 'ws://localhost:1883',
	ventiladorMAC: '3',
	bombaMAC: '2',
	iluminacaoMAC: '1',
	sensorMAC: '0'
};

angular.module('app', ['ngMQTT']);

angular.module('app').config(['MQTTProvider', function(MQTTProvider){
  MQTTProvider.setHref(config.address);
}]);

angular.module('app').controller('ctrl', ['$scope', 'MQTTService', function($scope, MQTTService) {

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

	MQTTService.on(config.eventMQTTName, function(data){
		if(typeof data === 'string') data = JSON.parse(data);
		var mac = data.mac;
		switch(mac) {
	    case sensorMAC:
	    	angular.extend($scope.sensor, {
					t: data.t,
					h: data.h,
					p: data.p
				});
	      break;
	    default:
        $scope.atuator[mac] = parseInt(data.value);
		}
  });

  $scope.itsOn = function(mac){
  	return $scope.atuator[mac] === config.onStatus;
  };

  $scope.onAtuadorClick = function(mac, value){
  	MQTTService.send(config.eventMQTTName, mac + ',' + value);
  	$scope.atuator[mac] = parseInt(value);
  };

}]);

angular.element(document).ready(function() {
	angular.bootstrap(document, ['app']);
});
