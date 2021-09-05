const utilities = require('../utilities');
const networkRequest = utilities.networkRequest;

module.exports = () => {
  return new Promise(async (resolve, reject) => {

    const reqObj = {
      url: `https://api.openweathermap.org/data/2.5/weather?q=Mumbai&units=metric&APPID=${process.env.WEATHER_API_KEY}`,
      method: 'GET'
    };

    let [error, res] = await utilities.safePromise(networkRequest(reqObj));

    if (error) {
      return reject(error);
    }
    
    let response = {
      city_temperature: Math.round(res.data.main.temp),
      city_weather: res.data.weather[0].description,
      sun_rise: new Date(res.data.sys.sunrise * 1000).toLocaleString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Kolkata',
      }),
      sun_set: new Date(res.data.sys.sunset * 1000).toLocaleString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Kolkata',
      })
    }

    return resolve(response);
  })
}