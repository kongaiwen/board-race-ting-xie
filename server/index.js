//require('dotenv').config({path: __dirname + '../.env'})
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const http = require('http');
const app = express();
const port = 3000;
const server = http.createServer(app);
const socketIO = require('socket.io');
const io = socketIO(server);
// const GOOGLE_API_KEY = require('../api_keys/googleAPI.js');
const vision = require('@google-cloud/vision');
const axios = require('axios');
//const GOOGLE_APPLICATION_CREDENTIALS = process.env['GOOGLE_APPLICATION_CREDENTIALS'];

const client = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  email: 'evanjk@board-race-ting-xie.iam.gserviceaccount.com',
  projectId: 'board-race-ting-xie'
});

app.use(cors());
app.use(bodyParser.json({
  limit: '16mb'
}));
app.use(bodyParser.urlencoded({
  extended: false,
  limit: '16mb'
}));
app.use(express.static(path.resolve(__dirname, '../public')));

app.post('/images', (req, res) => {
  // console.log(req.body.img);
  let base64Img = req.body.img;
  let startIndex = base64Img.indexOf(',');
  let base64Str = base64Img.slice(startIndex + 1);
  // console.log(base64Str);

  let request = {
    image: {
      content: base64Str
    }
  }
  client.textDetection(request, (err, response) => {
    // console.log(err);
    // console.log(response);
    // console.log(response.textAnnotations[1].description);
    if (response.textAnnotations[1] === undefined) {
      res.status(200).send('no idea!')
    } else {
      res.status(200).send(response.textAnnotations[1].description);
    }

  })
    // .then((result) => res.status(200).send(result))
    // .catch((error) => res.status(500).send(error))

})
io.on('connect', (socket) => {
  console.log('connecting')
  socket.on('mouseDown', (coords) => {
    socket.broadcast.emit('mouseDown', coords);
  })

  socket.on('mouseMove', (coords) => {
    socket.broadcast.emit('mouseMove', coords);
  })

  socket.on('mouseUp', () => {
    socket.broadcast.emit('mouseUp');
  })

  socket.on('receivedResults', (results) => {
    socket.broadcast.emit('receivedResults', results);
  })

  socket.on('gameStarted', (language) => {
    console.log(language);
    socket.broadcast.emit('gameStarted', language);
  })

  socket.on('nextWord', () => {
    socket.broadcast.emit('nextWord');
  })
})

server.listen(port, () => console.log('Listening on port', port));


