'use strict';

import _ from 'lodash';
import Device from './device.model';
import {getDeviceToken} from '../../auth/auth.service';
import DeviceEvents from './device.events';

function handleError(err) {
  console.error(err);
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

// Creates a new Device in the DB
function create(device) {
  return Device.create(device)
    .catch(handleError);
};

export default {
  register(socket, device) {
    if(!device.deviceId) {
      handleError('Can\'t register device without deviceId');
      return;
    }

    function registerAccept() {
      DeviceEvents.once('accept:' + device.deviceId, (data) => {
        socket.emit('device:accept', data);
      });
    }

    Device.findOne({ 'deviceId': device.deviceId }, function (err, dbDevice) {
      if (err) return handleError(err);
      if (!dbDevice) {
        create({deviceId: device.deviceId, state:'requested', authToken:getDeviceToken()});
        registerAccept();
      } else {
        if(!device.authToken) {
          return;
        } else {
          if(device.authToken === dbDevice.authToken) {
            registerAccept();
            dbDevice.accept();
          }
        }
      }
    });
  }
}
