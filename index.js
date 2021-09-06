const Mustache = require('mustache');
const fs = require('fs');
const utilities = require('./utilities');
const services = require('./services');
const puppeteerService = services.puppeteerService;
const getCryptoPrices = services.getCryptoPrices;

const MUSTACHE_MAIN_DIR = './main.mustache';

async function generateReadMe(valuesObj) {
  await fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
    if (err) throw err;
    const output = Mustache.render(data.toString(), valuesObj);
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

  let [error, data] = await utilities.safePromise(getCryptoPrices());

  response['bitcoin_price'] = data.find(o => o.id === 'bitcoin').current_price;
  response['ethereum_price'] = data.find(o => o.id === 'ethereum').current_price;
  response['dogecoin_price'] = data.find(o => o.id === 'dogecoin').current_price;

  /**
   * Get pictures
   */

  let imagesData = await puppeteerService.getLatestInstagramPostsFromAccount('johannesburginyourpocket', 3);

  response['img1'] = imagesData[0];
  response['img2'] = imagesData[1];
  response['img3'] = imagesData[2];

  /**
   * Generate README
   */
  await generateReadMe(response);

  /**
   * Fermeture de la boutique 👋
   */
  await puppeteerService.close();
}

action();