const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const http = require('http');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, '../public')));

app.listen(port, () => console.log('Listening on port', port));

