'use strict';

import mongoose from 'mongoose';
import DeviceEvents from './device.events';
import {getDeviceToken} from '../../auth/auth.service';

var DeviceSchema = new mongoose.Schema({
  name: String,
  info: String,
  state: String,
  online: Boolean,
  cluster: Array,
  authToken: String,
  keys: Array,
  socketId: String,
});

function emitEvent(event) {
  return (doc) => {
    var token = doc.authToken;
    doc.authToken = undefined;
    DeviceEvents.emit(event + ':' + doc._id, doc);
    DeviceEvents.emit(event, doc);
    doc.authToken = token;
  }
}

// Register the event emitter to the model events
for (var e in DeviceEvents.events) {
  var event = DeviceEvents.events[e];
  DeviceSchema.post(e, emitEvent(event));
}

DeviceSchema.methods = {
  accept() {
    this.state = 'accepted';
    this.online = true;
    //TODO: work this out!! 
    //this.authToken = getDeviceToken();
    this.save().then(entity => {
      DeviceEvents.emit('accept:' + entity._id, {deviceId: entity._id, authToken: entity.authToken});
    });
  }
};

export default mongoose.model('Device', DeviceSchema);
