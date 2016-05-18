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

function registerAccept(device, socket) {
  var accepted = (data) => {
    socket.authenticated = true;
    socket.join(device._id);
    socket.emit('device:accept', data);
  };
  DeviceEvents.once('accept:' + device._id, accepted);
  socket.on('disconnect', () => {
    DeviceEvents.removeListener('accept:' + device._id, accepted);
  });
};

export default {
  register(socket, device) {
    if(device && device.deviceId && device.authToken) {
      Device.findById(device.deviceId, (err, dbDevice) => {
        if (err) return handleError(err);
        if(dbDevice && dbDevice.state === 'accepted' && device.authToken === dbDevice.authToken) {
          registerAccept(dbDevice, socket);
          socket.deviceId = dbDevice._id;
          dbDevice.accept();
        } else {
          socket.emit('device:reject');
        }
      });
    } else if(!device) {
      create({online: true, state:'requested'})
        .then((device) => {
          socket.deviceId = device._id;
          registerAccept(device, socket);
        });
    }
  },

  goOffline(deviceId) {
    Device.findById(deviceId, (err, dbDevice) => {
      if (err) return handleError(err);
      if (!dbDevice) return;
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
      Device.findById(socket.deviceId, (err, device) => {
        if (err) return handleError(err);
        if (!device) return;
        socket.to(data.target).emit('device:command', data.payload);;
        Device.find({cluster: data.target}, (err, devices) => {
          for(var device of devices) {
            socket.to(device._id).emit('device:command', data.payload);
          }
        });
      });
    }
  }
}
