class WeatherClient {
    constructor() {
        this.WEATHER_DATA = require('./weather.json');
    }

    /*
    * Update this method with an actual Weather API call
    */
    getWeather(cityName, date) {
        if (cityName === null) {
            return {};
        }

        // For now let's assume, we are only returning today's temperature
        // because we are using mock data from weather.json instead of using a real time weather service
        date = 'today';

        return this.WEATHER_DATA[date][cityName] || this.WEATHER_DATA[date]['seattle'];
    }
}

module.exports = new WeatherClient();