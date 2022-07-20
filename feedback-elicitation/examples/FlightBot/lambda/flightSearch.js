const FLIGHT_DATA = require('./flight-data.json');

// query to the flight database
module.exports.getFlightData = (cityFrom, cityTo) => {
    if (cityFrom && FLIGHT_DATA[cityFrom] && cityTo && FLIGHT_DATA[cityFrom][cityTo] ) {
        return FLIGHT_DATA[cityFrom][cityTo]
    }
    return {
        "cost": "",
        "time": "",
        "airline": ""
    };
};