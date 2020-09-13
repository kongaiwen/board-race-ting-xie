require('dotenv').config({path: __dirname + '../.env'})
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
const GOOGLE_APPLICATION_CREDENTIALS = process.env['GOOGLE_APPLICATION_CREDENTIALS'];

const client = new vision.ImageAnnotatorClient({
  keyFilename: GOOGLE_APPLICATION_CREDENTIALS,
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
  console.log(req.body.img);
  let base64Img = req.body.img;
  let startIndex = base64Img.indexOf(',');
  let base64Str = base64Img.slice(startIndex + 1);
  console.log(base64Str);

  let request = {
    image: {
      content: base64Str
    }
  }
  client.textDetection(request, (err, response) => {
    console.log(err);
    console.log(response);
  })
    // .then((result) => res.status(200).send(result))
    // .catch((error) => res.status(500).send(error))

})
io.on('connection', (socket) => {
  console.log('connecting')
  socket.on('listeningForHello', () => {
    let string = 'hello';
    io.sockets.emit('sendingHello', string);
  })
})

server.listen(port, () => console.log('Listening on port', port));

