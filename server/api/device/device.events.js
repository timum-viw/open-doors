/**
 * Device model events
 */

'use strict';

import {EventEmitter} from 'events';
var DeviceEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
DeviceEvents.setMaxListeners(0);

// Model events
DeviceEvents.events = {
  'save': 'save',
  'remove': 'remove'
};

export default DeviceEvents;
