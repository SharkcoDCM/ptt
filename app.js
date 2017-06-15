var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var moment = require('moment');
var fs = require("fs");

var port = process.env.PORT || 3000;

// app.get('/', function (req, res) {
//   res.send('Hello World')
// })


io.on('connection', function(socket){ 

        console.log(`userConnected - ${moment().format('YYYY-MM-DD HH:mm:ss')} `);
        console.log(`Client ID is : ${socket.id} - ${moment().format('YYYY-MM-DD HH:mm:ss')}`);

        socket.on('add user', function (username) {
            // we tell the client to execute 'new message'
            console.log(`${username} newly added - ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
            socket.username = username;
            socket.emit('new message', { username:socket.username, message : `welcome dear ${username}`});

        });
        socket.on('message', function (data) {
            // we tell the client to execute 'new message'
            // socket.broadcast.emit('new message', {username: socket.username,message: data});
            console.log(`message ${data} - ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
            socket.emit('new message', {username: socket.username,message: data});

        });

        socket.on("audio", function (data) {

            // console.log(`audio buffer - ${moment().format('YYYY-MM-DD HH:mm:ss')} 
            // -- ${data.filename} -- ${data.length} -- ${data.audio}`);


            // If you want to force the file to be empty then you want to use the 'w' flag instead:
            // var filepath = __dirname + "/" + data.filename ; 
            // fs.closeSync(fs.openSync(filepath, 'w')); // i do not need file descriptor's return.


            var dir = __dirname + "/audio/" + socket.username;
            if (!fs.existsSync(dir)){
                 fs.mkdirSync(dir);
            }

            fs.writeFile(dir + "/" + data.filename, data.audio, 'base64',function(err) {
                  if (err) throw err;
                  // console.log(result);
                  // console.log(err);
            });
            socket.broadcast.emit('new audio', {username :socket.username, filename: data.filename,audio: data.audio});
            

        });

        socket.on('disconnect', function(){ 
            console.log(`userDisconnected - ${moment().format('YYYY-MM-DD HH:mm:ss')} `);
        });

 });

server.listen(port);