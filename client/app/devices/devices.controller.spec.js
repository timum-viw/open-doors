'use strict';

describe('Component: DevicesComponent', function () {

  // load the controller's module
  beforeEach(module('openDoorsApp'));

  var DevicesComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    DevicesComponent = $componentController('DevicesComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
