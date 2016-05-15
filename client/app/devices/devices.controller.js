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
    this.socket.socket.emit('device:register', {deviceId: '5738d403805ae90d3809e48c', authToken:'MtRci/KeSFe0klrBW+W5P2ACjtBTDaWRezYOCKqa2qM6e7CTjNNXXIc02YWqJjQAAKe7w660H12o0LjRGvXtdL4JTpllfZfHRH/Xvx8nvSBybG2ql6B8dI4JhX9ph0HTwEjVx95Ya5s7S/gA+lPZvTHiROwUPvaBza0K8ECuiyMg8f+PKLFwluEpE2K+yEeVsmzmHM4Bnfk0fD02iSeCc1zha5M8Pa1H3aDSeNP+2iPlO5VSHTIdSEFMdJeVNaKyNM5LiUMrYAAwhPlHZxT6o2igSR7LJQ28PGyVblSDpp0Q1rPJxK1KB6kpNUSLxMCFWTVRH9w0x6sqnMSdRByq2w=='});
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
