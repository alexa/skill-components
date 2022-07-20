// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

type WeatherData = Record<string, Record<CityName, CityTemp>>;
const WEATHER_DATA: WeatherData = require('./data/weather-data.json');

type CityName = string;
interface CityTemp {
    lowTemperature: number;
    highTemperature: number;
}

//Get weather API to get the weather for cityName and date passed as arguments.
export function getWeather(cityName:CityName, date: string): CityTemp {
    if (cityName === "") {
        return {} as CityTemp;
    }

    // For now let's assume, we are only returning today's temperature
    // because we are using mock data from weather.json instead of using a real time weather service
    date = 'today';

    return WEATHER_DATA[date][cityName] || WEATHER_DATA[date]["seattle"];
}