'use strict';

var fs = require('fs');

// Server setup
const express = require('express');
const socketIO = require('socket.io');
const routes = require('./routes');
const PORT = process.env.PORT || 3000;

// Require child process
var spawn = require('child_process').spawn;

// create HTTP server, initialize to listen on 3000 for SocketIO
var app = express();
const chatServer = app.listen(PORT, () => {
  console.log('listening on ${ PORT }')
});
const io = socketIO(chatServer);

// send all requests through routes
app.use('/', routes);

// Start MC server manually
var minecraftServerProcess = spawn('java', [
    '-Xmx512M',
    '-Xms256M',
    '-jar',
    'minecraft_server.1.11.jar',
    'nogui'
]);
minecraftServerProcess.stdout.setEncoding('utf-8');
minecraftServerProcess.stdout.setEncoding('utf-8');

// log events from MC server to console
function log(data) {
    process.stdout.write(data.toString());
}
minecraftServerProcess.stdout.on('data', log);
minecraftServerProcess.stderr.on('data', log);

// Handle connections
io.on('connection', (socket) => {
  console.log('Client connected');
  //getLatestLog();
  socket.on('disconnect', () => console.log('Client disconnected'));
  socket.on('command', function(command) {
    console.log("command: " + command);
    minecraftServerProcess.stdin.write(command+'\n');
  });
});

// Emit events from MC server to console
minecraftServerProcess.stdout.on('data', function(data) {
  io.emit('log', data + '\n');
});
minecraftServerProcess.stderr.on('data', function(data) {
  io.emit('log', data + '\n');
});

// Get latest logs for new connections
function getLatestLog() {
  fs.readFile('logs/latest.log', 'utf8', function(err,data) {
    if (err) {
      return console.log(err);
    }
    var newString = data.replace('<', '[');
    newString = newString.replace('>', ']');
    // emit shouldnt be used for updating a single person. Should make call to database and return.
    io.emit('log', newString + '\n');
  });
}
