'use strict';

import _ from 'lodash';
import Device from './device.model';

function handleError(err) {
  console.log(err);
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

export default {
  // Creates a new Device in the DB
  create(device) {
    return Device.create(device)
      .catch(handleError(res));
  },

  register(device) {
    if(!device.deviceId) {
      handleError('Can\'t register device without deviceId');
      return;
    }

    Device.findOne({ 'deviceId': device.deviceId }, function (err, dbDevice) {
      if (err) return handleError(err);
      if (!dbDevice) {
        create({deviceId: device.deviceId});
      }
    });
  }
}
