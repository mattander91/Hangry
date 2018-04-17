const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const helpers = require('./helpers.js');

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../client/dist/')));

app.post('/api/search', (req, res) => {
  let location = req.body.location;
  let userQuery = req.body.query;
  helpers.groupByRestaurant(location, userQuery, (data) => {
    if (data) {
      res.status(201).send(data);
    }
  });
});



let port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('listening on port ' + port);
});
