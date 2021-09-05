require('dotenv').config();
const Mustache = require('mustache');
const axios = require('axios');
const fs = require('fs');
const services = require('./services');
const utilities = require('./utilities');
const puppeteerService = services.puppeteerService;
const getWeatherInfo = services.getWeatherInfo;

const MUSTACHE_MAIN_DIR = './main.mustache';

let response = {
  refresh_date: new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
    timeZone: 'Asia/Kolkata',
  }),
};

async function setWeatherInformation() {

  const reqObj = {
    url: `https://api.openweathermap.org/data/2.5/weather?q=Mumbai&units=metric&APPID=${process.env.WEATHER_API_KEY}`,
    method: 'get'
  };

  await axios(reqObj)
    .then(res => {
      response['city_temperature'] = Math.round(res.data.main.temp);
      response['city_weather'] = res.data.weather[0].description;
      response['sun_rise'] = new Date(res.data.sys.sunrise * 1000).toLocaleString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Kolkata',
      });
      response['sun_set'] = new Date(res.data.sys.sunset * 1000).toLocaleString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Kolkata',
      });
    })
}

async function setInstagramPosts() {
  const instagramImages = await puppeteerService.getLatestInstagramPostsFromAccount('johannesburginyourpocket', 3);
  response.img1 = instagramImages[0];
  response.img2 = instagramImages[1];
  response.img3 = instagramImages[2];
}

async function generateReadMe() {
  await fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
    if (err) throw err;
    const output = Mustache.render(data.toString(), response);
    fs.writeFileSync('README.md', output);
  });
}

async function action() {

  let response = {
    refresh_date: new Date().toLocaleDateString('en-GB', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short',
      timeZone: 'Asia/Kolkata',
    }),
  };

  let [error, data] = await utilities.safePromise(getWeatherInfo());

  response.city_temperature = data.city_temperature;
  response.city_weather = data.city_weather;
  response.sun_rise = data.sun_rise;
  response.sun_set = data.sun_set;

  /**
   * Get pictures
   */

  await setInstagramPosts();

  /**
   * Generate README
   */
  await generateReadMe();

  /**
   * Fermeture de la boutique 👋
   */
  await puppeteerService.close();
}

action();