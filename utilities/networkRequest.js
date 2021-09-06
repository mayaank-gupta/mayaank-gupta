const axios = require('axios');

module.exports = (reqObj) => {
  return new Promise((resolve, reject) => {

    axios({
      method: reqObj.method,
      url: reqObj.url,
      responseType: 'json'
    })
      .then(function (response) {
        return resolve(response);
      })
      .catch(function (err) {
        return reject(err);
      })

  });
}