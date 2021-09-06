const utilities = require('../utilities');
const networkRequest = utilities.networkRequest;

module.exports = () => {
  return new Promise(async (resolve, reject) => {

    const reqObj = {
      url: `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1&sparkline=false`,
      method: 'get'
    };

    let [error, res] = await utilities.safePromise(networkRequest(reqObj));

    if (error) {
      return reject(error);
    }

    if (res.data.length) {
      res = res.data.map(el => {
        return {
          id: el.id,
          current_price: el.current_price,
          name: el.name,
          image: el.image
        }
      })
    }

    return resolve(res);
  });
}