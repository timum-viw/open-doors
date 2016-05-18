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

  getClusters() {
    return this.devices.map((device) => {return device.cluster;})
            .reduce((result, cluster) => {return result.concat(cluster);});
  }

  save(device) {
    this.$http.put('/api/devices/' + device._id, device);
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
