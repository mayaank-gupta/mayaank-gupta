const axios = require('axios');
const safePromise = require('./safe-promise');

module.exports = (reqObj) => {
  return new Promise((resolve, reject) => {

    let obj = {
      method: reqObj.method,
      url: reqObj.url,
      responseType: 'json'
    }

    let [err, data] = await safePromise(axios(obj));

    if (err) {
      return reject(err);
    }

    return resolve(data);

  })
}