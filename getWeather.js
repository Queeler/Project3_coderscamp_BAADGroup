//Constants
const APIKEY = "8ac0c51e406de21860581c6481538617";
//On page load
let citiesList;
let testData;
let countryCodes;
let f;

document.addEventListener("DOMContentLoaded", function(){
    document.getElementById('getWeather').addEventListener('click', getWeather);
    document.getElementById('getForecast').addEventListener('click', getForecast);
    document.getElementById('town').addEventListener('keyup', populateSuggestions);
    document.body.addEventListener("click", function(){
        document.getElementById('towns').innerHTML = '';
    });
    getCitiesList(); 
    getCodesList();
});

function getWeather(){
    let townField = document.getElementById('town').value;
    let arr = townField.split('|');
    let weatherOutput = '';
    fetch('https://api.openweathermap.org/data/2.5/weather?APPID=' + APIKEY + '&units=metric&q=' + arr[0] +',' + arr[1])
    .then((res) => {
        if(!res.ok){
            throw Error(res.statusText);
        }
        return res.json();
    })
    .then((data) => { 
            weatherOutput = `<p id="location"><strong>Weather in ${data.name}, ${searchCode(data.sys.country)}</strong></p>`
            weatherOutput += `<p id="temperature"><img src="images/${data.weather[0].icon}.png"> <strong>${data.main.temp} °C</strong></p>`
            weatherOutput += `<p id="description"><strong>${(data.weather[0].description).charAt(0).toUpperCase()}${data.weather[0].description.substr(1, data.weather[0].description.length)}</strong></p>`
            let windDirection = "";
            let sunriseUnix = new Date(data.sys.sunrise*1000);
            let sunsetUnix = new Date(data.sys.sunset*1000);
            if(data.wind.deg >= 348 || data.wind.deg < 11){
                windDirection = "North (" + data.wind.deg + ")";
            } else if(data.wind.deg >= 11 && data.wind.deg < 78){
                windDirection = "North-east (" + data.wind.deg + ")"; 
            } else if(data.wind.deg >= 78 && data.wind.deg < 101){
                windDirection = "East (" + data.wind.deg + ")"; 
            } else if(data.wind.deg >= 101 && data.wind.deg < 168){
                windDirection = "South-east (" + data.wind.deg + ")"; 
            } else if(data.wind.deg >= 168 && data.wind.deg < 191){
                windDirection = "South (" + data.wind.deg + ")"; 
            } else if(data.wind.deg >= 191 && data.wind.deg < 258){
                windDirection = "South-west (" + data.wind.deg + ")"; 
            } else if(data.wind.deg >= 258 && data.wind.deg < 281){
                windDirection = "West (" + data.wind.deg + ")"; 
            } else if(data.wind.deg >= 281 && data.wind.deg < 348){
                windDirection = "North-west (" + data.wind.deg + ")"; 
            }
            weatherOutput += `<table id="weatherData"><tbody><tr><td>Wind</td><td>${data.wind.speed} m/s, ${windDirection}</td></tr>
            <tr><td>Humidity</td><td>${data.main.humidity} %</td></tr>
            <tr><td>Pressure</td><td>${data.main.pressure} hpa</td></tr>
            <tr><td>Geo coords</td><td><a href="https://google.com/maps/search/${data.coord.lat},${data.coord.lon}" target="_blank">[${data.coord.lat}, ${data.coord.lon}]</a></td></tr>
            <tr><td>Sunrise</td><td>${sunriseUnix.getHours()}:${sunriseUnix.getMinutes()}</td></tr>
            <tr><td>Sunset</td><td>${sunsetUnix.getHours()}:${sunsetUnix.getMinutes()}</td></tr>
            `
            if(data.hasOwnProperty("rain")){
                if(data.rain.hasOwnProperty("1h")){
                    weatherOutput += `<tr><td>Rain</td><td>${data.rain["1h"]} mm</td></tr>`
                } else{
                    weatherOutput += `<tr><td>Rain</td><td>${data.rain["3h"]} mm</td></tr>`
                }
            }
            weatherOutput += `</tbody></table>`;
            document.getElementById('weather-container').innerHTML = weatherOutput;
            document.getElementById('weather-container').style.visibility = "visible";
            testData = [data.name, data.main.temp, data.main.pressure, data.main.humidity];
        })
        .catch(() => {
            document.getElementById('errorText').innerHTML = "The city you entered does not exist in data base";
        }); 
        if(gl !== 1){
            document.getElementById('town').value = "";
        }       
}

function getForecast(event){
    event.preventDefault();
    let townField = document.getElementById('town').value;
    let arr = townField.split('|');
    let forecastOutput = '';
    fetch('https://api.openweathermap.org/data/2.5/forecast?APPID=' + APIKEY + '&units=metric&q=' + arr[0] + ',' + arr[1])
    .then((res) => {
        if(!res.ok){
            throw Error(res.statusText);
        }
        return res.json();
    })
    .then((data) => {
        forecastOutput = `<div id="selectDiv"><select id="selectDay"><option disabled hidden value="${arr[0]}"></option><option disabled hidden value="${arr[1]}"></option>`
        for(let i = 0; i < data.list.length; i += 2){
            forecastOutput += `<option value="${data.list[i].dt_txt}">${data.list[i].dt_txt}</option>`;
        }
        forecastOutput += `</select> <button id="selectForecast" onclick="selectForecast()">choose</button></div>`;
        document.getElementById('weather-container').innerHTML = forecastOutput;
        document.getElementById('weather-container').style.visibility = "visible";
        f = data.list;
    })
    .catch((err) => {
        console.log(err);
        document.getElementById('errorText').innerHTML = "The city you entered does not exist in data base";
    });
    if(gl !== 1){
        document.getElementById('town').value = "";
    }
}

function selectForecast(){
    let choosenOption = document.getElementById('selectDay').value;
    let disabledOption1 = document.getElementById('selectDay').options[0].value;
    let disabledOption2 = document.getElementById('selectDay').options[1].value;
    let selectDiv = document.getElementById('selectDiv').innerHTML;
    let select = `<div id="selectDiv">${selectDiv}</div>`;
    f.forEach((forecast) => {
        if(forecast.dt_txt === choosenOption){
            select += `<p id="location"><strong>Weather in ${disabledOption1}, ${disabledOption2}</strong></p>`
            select += `<p id="temperature"><img src="images/${forecast.weather[0].icon}.png"> <strong>${forecast.main.temp} °C</strong></p>`
            select += `<p id="description"><strong>${(forecast.weather[0].description).charAt(0).toUpperCase()}${forecast.weather[0].description.substr(1, forecast.weather[0].description.length)}</strong></p>`
            let windDirection = "";
            if(forecast.wind.deg >= 348 || forecast.wind.deg < 11){
                windDirection = "North (" + forecast.wind.deg + ")";
            } else if(forecast.wind.deg >= 11 && forecast.wind.deg < 78){
                windDirection = "North-east (" + forecast.wind.deg + ")"; 
            } else if(forecast.wind.deg >= 78 && forecast.wind.deg < 101){
                windDirection = "East (" + forecast.wind.deg + ")"; 
            } else if(forecast.wind.deg >= 101 && forecast.wind.deg < 168){
                windDirection = "South-east (" + forecast.wind.deg + ")"; 
            } else if(forecast.wind.deg >= 168 && forecast.wind.deg < 191){
                windDirection = "South (" + forecast.wind.deg + ")"; 
            } else if(forecast.wind.deg >= 191 && forecast.wind.deg < 258){
                windDirection = "South-west (" + forecast.wind.deg + ")"; 
            } else if(forecast.wind.deg >= 258 && forecast.wind.deg < 281){
                windDirection = "West (" + forecast.wind.deg + ")"; 
            } else if(forecast.wind.deg >= 281 && forecast.wind.deg < 348){
                windDirection = "North-west (" + forecast.wind.deg + ")"; 
            }
            select += `<table id="weatherData"><tbody><tr><td>Wind</td><td>${forecast.wind.speed} m/s, ${windDirection}</td></tr>
            <tr><td>Humidity</td><td>${forecast.main.humidity} %</td></tr>
            <tr><td>Pressure</td><td>${forecast.main.pressure} hpa</td></tr>`
            if(forecast.hasOwnProperty("rain")){
                if(forecast.rain.hasOwnProperty("1h")){
                    select += `<tr><td>Rain</td><td>${forecast.rain["1h"]} mm</td></tr>`
                } else{
                    select += `<tr><td>Rain</td><td>${forecast.rain["3h"]} mm</td></tr>`
                }
            }
            select += `</tbody></table>`;
            document.getElementById('weather-container').innerHTML = select;
            document.getElementById('weather-container').style.visibility = "visible";
        }
    });
}

function populateSuggestions(){
    document.getElementById('towns').innerHTML = '';
    let townField = document.getElementById('town').value;
    let counter = 0;
    let output = '';
        for(var i = 0; i < citiesList.length; i++){
            if(citiesList[i].name.substr(0, townField.length).toUpperCase() === townField.toUpperCase() && townField.length > 0){
                output += `<div onclick="fillTextbox(this)"><strong>${citiesList[i].name} | ${searchCode(citiesList[i].country)} </strong><input type="hidden" value="${citiesList[i].name}"><input type="hidden" value="${citiesList[i].country}"><input type="hidden" value="${citiesList[i].id}"></div>`;
                counter++;
            }
            if(counter === 14){
                break;
            }
        }
    document.getElementById('towns').innerHTML = output;
}

function fillTextbox(el){
    document.getElementById('town').value = el.getElementsByTagName('input')[0].value + "|" + searchCode(el.getElementsByTagName('input')[1].value);
    document.getElementById('towns').innerHTML = '';
}

async function fetchCities(){
    let response = await fetch('cityList.json');
    let data = response.json();
    return data;
}

async function fetchCodes(){
    let response = await fetch('countryCodes.json');
    let data = response.json();
    return data;
}

async function getCitiesList(){
    let dataset = await fetchCities();
    citiesList = dataset;
}

async function getCodesList(){
    let dataset = await fetchCodes();
    countryCodes = dataset;
}

function searchCode(fetchedCode){
    return countryCodes[fetchedCode];
}