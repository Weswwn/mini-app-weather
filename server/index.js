require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000
const morgan = require('morgan');
const axios = require('axios');
const bodyParser = require('body-parser');
const {findWeatherData, insertWeatherData} = require('../database/controller.js');

app.use(express.static('public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }))

app.get('/api/weather', (req, res, next) => {
  // Check if database already holds the data that we are trying to GET'
  findWeatherData((err, data)=>{
    if (err) {
      next(err);
    } else {
      if (data.length === 0) {
        axios.get('http://api.openweathermap.org/data/2.5/forecast?', {
          params: {
              id: 5391959,
              appid: process.env.WEATHERAPIKEY,
              units: 'imperial'
          }
        })
        .then((response) => {
            insertWeatherData(response.data.list);
            res.send(response.data);
        })
        .catch((error) => {
            next(error);
            console.log(error);
            res.sendStatus(400);
        })
      } else {
        res.send(data);
      }
    }
  })
})


app.listen(port, () => console.log(`Loading Bar Mini App listening on port ${port}!`))