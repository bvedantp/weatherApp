/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-use-before-define */
import './style.scss';
import 'whatwg-fetch';

const timezoneDisplay = document.getElementsByClassName('time-zone')[0];
const tempDisplay = document.getElementsByClassName('temp')[0];
const weatherDisplay = document.getElementsByClassName('weather')[0];
const cityInput = document.getElementById('search');
const citySearchButton = document.getElementById('searchStart');
const getLocation = document.getElementById('current-loc');
const cityNameDisplay = document.getElementById('city-name');

async function returnWeather(location, units) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${units}&appid=b3549bd3f6f519902ae3c5a9ed9abdf2`, { mode: 'cors' });
    // always add https to fetch request as well as cors mode
    const locInfo = await response.json();
    // eslint-disable-next-line no-unused-vars
    const datum = returnData(locInfo);
    console.log(datum);
    return datum;
    // fetchLocation();
}

async function fetchLocation() {
    const response = await fetch(`https://ipgeolocation.abstractapi.com/v1/?api_key=9fe767eb4c964332ba2841faa0d8f400`);
    const currLoc = await response.json();
    console.log(currLoc.city);
    return currLoc.city;
}

getLocation.addEventListener('click', () => {
    // fetchLocation();
    onFirstLoad().catch((err) => {
        alert(`IT NO WORK!!!`);
    });
});

function convertTime(offvalue) { // to convert time offset value to understandable date/time
    const currTime = new Date();
    const localTime = currTime.getTime();
    const localOffset = currTime.getTimezoneOffset() * 60000;
    const utc = localTime + localOffset;
    const currCityTime = utc + (1000 * `${offvalue}`);
    const nd = new Date(currCityTime);
    return nd;
}

function returnData(information) {
   const temperature = information.main.temp;
   const tempMax = information.main.temp_max;
   const tempMin = information.main.temp_min;
   const humiditi = information.main.humidity;
   const cityName = information.name;
   const weatherType = information.weather[0].main;
   const weatherDesc = information.weather[0].description;
   const windSpeed = information.wind.speed;
   const timeZone = convertTime(information.timezone);

   return {
       temperature, tempMax, tempMin, humiditi, timeZone, cityName, weatherType, weatherDesc, windSpeed,
    };
}

citySearchButton.addEventListener('click', () => {
    // eslint-disable-next-line prefer-destructuring
    const value = cityInput.value;
    // returnWeather(`${value}`, 'metric');
    initLoad(value).catch((err) => {
        alert(`IT NO WORK!!!`);
    });
});

async function initLoad(value) {
    // const value = await fetchLocation();
    const datum = await returnWeather(`${value}`, 'metric');
    const displayTime = `${datum.timeZone}`;
    const timetime = displayTime.split(' ');

    const timeZoneBefore = document.createElement('div');
    const timeZoneAfter = document.createElement('div');
    const tempMaxDisplay = document.createElement('div');
    const tempMinDisplay = document.createElement('div');
    const weatherTypeDisplay = document.createElement('div');

    timeZoneBefore.textContent = `${timetime[0]}`;
    timezoneDisplay.textContent = `${timetime[1]} ${timetime[2]} ${timetime[3]}`;
    timeZoneAfter.textContent = `${timetime[4]}`;

    tempDisplay.textContent = `Temp: ${datum.temperature}`;
    tempMaxDisplay.textContent = `Max: ${datum.tempMax}`;
    tempMinDisplay.textContent = `Min: ${datum.tempMin}`;

    weatherDisplay.textContent = `${datum.weatherType}`;
    weatherTypeDisplay.textContent = `${datum.weatherDesc}`;
    cityNameDisplay.textContent = `${datum.cityName}`;

    timezoneDisplay.appendChild(timeZoneBefore);
    timezoneDisplay.appendChild(timeZoneAfter);
    tempDisplay.appendChild(tempMaxDisplay);
    tempDisplay.appendChild(tempMinDisplay);
    weatherDisplay.appendChild(weatherTypeDisplay);
}

async function onFirstLoad() {
    const value = await fetchLocation();
    initLoad(value).catch((err) => {
        alert(`IT NO WORK!!!`);
    });
}

onFirstLoad();
// initLoad();
