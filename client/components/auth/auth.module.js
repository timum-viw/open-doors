'use strict';

angular.module('openDoorsApp.auth', [
  'openDoorsApp.constants',
  'openDoorsApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
