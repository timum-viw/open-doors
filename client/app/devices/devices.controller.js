'use strict';
(function(){

class DevicesComponent {
  constructor(socket, $scope, $http) {
    this.$http = $http;
    this.socket = socket;
    this.devices = [];

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('device');
    });
  }

  $onInit() {
    this.$http.get('/api/devices').then(response => {
      this.devices = response.data;
      this.socket.syncUpdates('device', this.devices);
    });
  }

  addDevice() {
    this.socket.socket.emit('device:register', {deviceId:'123'});
  }

  acceptDevice(device) {
    this.$http.put('/api/devices/' + device._id + '/accept');
  }

  removeDevice(device) {
    this.$http.delete('/api/devices/' + device._id);
  }
}

angular.module('openDoorsApp')
  .component('devices', {
    templateUrl: 'app/devices/devices.html',
    controller: DevicesComponent
  });

})();
