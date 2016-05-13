'use strict';

class NavbarController {
  //start-non-standard

  isCollapsed = true;
  //end-non-standard

  constructor(Auth) {
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
    this.menu = [{
      'title': 'Home',
      'state': 'main'
    },
    {
      'title': 'Devices',
      'state': 'devices',
      'role': ['admin'],
    },
    {
      'title': 'Admin',
      'state': 'admin',
      'role': ['admin'],
    }];
  }

  showMenuItem() {
    return (item) => {
      return !angular.isDefined(item.role) || (this.getCurrentUser() && item.role.indexOf(this.getCurrentUser().role) !== -1);
    };
  }
}

angular.module('openDoorsApp')
  .controller('NavbarController', NavbarController);
