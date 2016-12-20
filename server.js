'use strict';

// Server setup
const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

// Require child process
var spawn = require('child_process').spawn;

// create HTTP server
const server = express()
  .use((req, res) => res.sendFile(INDEX))
  .listen(PORT, () => console.log('listening on ${ PORT }'));

const io = socketIO(server);

// Start MC server manually
var minecraftServerProcess = spawn('java', [
    '-Xmx512M',
    '-Xms256M',
    '-jar',
    'minecraft_server.1.10.2.jar',
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
