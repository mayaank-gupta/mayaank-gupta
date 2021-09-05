require('dotenv').config();
const Mustache = require('mustache');
const utilities = require('./utilities');
const fs = require('fs');
const services = require('./services');
const puppeteerService = services.puppeteerService;
const getWeatherInfoService = services.getWeatherInfo;

const MUSTACHE_MAIN_DIR = './main.mustache';

let error;

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
  [error, data] = await utilities.safePromise(getWeatherInfoService());
  response = { ...response, ...data };
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
  /**
   * Fetch Weather
   */
  await setWeatherInformation();

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