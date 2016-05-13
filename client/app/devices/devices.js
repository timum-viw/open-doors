'use strict';

angular.module('openDoorsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('devices', {
        url: '/devices',
        template: '<devices></devices>',
        authenticate: 'admin'
      });
  });
