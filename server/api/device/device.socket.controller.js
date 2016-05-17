'use strict';

import Device from './device.model';
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

    function registerAccept(deviceId) {
      var listener = (data) => {
        socket.authenticated = true;
        socket.emit('device:accept', data);
      };
      DeviceEvents.once('accept:' + deviceId, listener);
      socket.on('disconnect', () => {
        DeviceEvents.removeListener('accept:' + deviceId, listener);
      });
    }

    if(device && device.deviceId && device.authToken) {
      Device.findById(device.deviceId, (err, dbDevice) => {
        if (err) return handleError(err);
        if(dbDevice && dbDevice.state === 'accepted' && device.authToken === dbDevice.authToken) {
          registerAccept(device.deviceId);
          socket.deviceId = device.deviceId;
          dbDevice.accept();
        }
      });
    } else if(!device) {
      create({online: true, state:'requested'})
        .then((device) => {
          socket.deviceId = device._id;
          registerAccept(device._id);
        });
    }
  },

  goOffline(deviceId) {
    Device.findById(deviceId, (err, dbDevice) => {
      if (err) return handleError(err);
      dbDevice.online = false;
      if(dbDevice.state !== 'accepted') {
        dbDevice.remove();
      } else {
        dbDevice.save();
      }
    });
  },

  command(socket, data) {
    if(socket.deviceId && socket.authenticated) {
      Device.findById(deviceId, (err, device) => {
        if (err) return handleError(err);
        DeviceEvents.emit('command:' + data.target, data.payload);
      });
    }
  }
}
