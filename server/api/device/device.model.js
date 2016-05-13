'use strict';

import mongoose from 'mongoose';
import DeviceEvents from './device.events';

var DeviceSchema = new mongoose.Schema({
  name: String,
  info: String,
  deviceId: String,
  state: String,
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
    this.save().then(entity => {
      DeviceEvents.emit('accept:' + entity.deviceId, {authToken: entity.authToken});
    });
  }
};

export default mongoose.model('Device', DeviceSchema);
