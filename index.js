require('dotenv').config();
const Mustache = require('mustache');
const fs = require('fs');
const fetch = require('node-fetch');
const services = require('./services');
const puppeteerService = services.puppeteerService;

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
  })
};

async function setWeatherInformation() {
  await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=Mumbai&units=metric&APPID=${process.env.WEATHER_API_KEY}`
  )
    .then(r => r.json())
    .then(r => {
      response.city_temperature = Math.round(r.main.temp);
      response.city_weather = r.weather[0].description;
      response.city_weather_icon = r.weather[0].icon;
      response.sun_rise = new Date(r.sys.sunrise * 1000).toLocaleString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Kolkata',
      });
      response.sun_set = new Date(r.sys.sunset * 1000).toLocaleString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Kolkata',
      });
    });
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

  await setWeatherInformation();

  await setInstagramPosts();

  await generateReadMe();

  await puppeteerService.close();
}

action();