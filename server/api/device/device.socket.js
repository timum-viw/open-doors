/**
 * Broadcast updates to client when the model changes
 */

'use strict';

import DeviceEvents from './device.events';
import SocketContoller from './device.socket.controller';

// Model events to emit
var unauthenticatedEvents = [];
var authenticatedEvents = ['save', 'remove'];
var unauthenticatedListeners = [{event: 'register', callback: SocketContoller.register}];
var authenticatedListeners = [];

export function register(socket, events) {
  events = events || unauthenticatedEvents;
  // Bind model events to socket events
  for (var i = 0, eventsLength = events.length; i < eventsLength; i++) {
    var event = events[i];
    var listener = createListener('device:' + event, socket);

    DeviceEvents.on(event, listener);
    socket.on('disconnect', removeListener(event, listener));
  }
}

export function registerAuthenticated(socket) {
  register(socket, authenticatedEvents);
}

export function registerListeners(socket, listeners) {
  listeners = listeners || unauthenticatedListeners;
  for(var {event, callback} of listeners) {
      socket.on('device:' + event, callback.bind(this, socket));
  }
}

export function registerAuthenticatedListeners(socket) {
  registerListeners(socket, authenticatedListeners);
}

function createListener(event, socket) {
  return function(doc) {
    socket.emit(event, doc);
  };
}

function removeListener(event, listener) {
  return function() {
    DeviceEvents.removeListener(event, listener);
  };
}

export function onDisconnect(socket) {
  if(socket.deviceId) {
    SocketContoller.goOffline(socket.deviceId);
  }
}
