//Constants
const APIKEY = "8ac0c51e406de21860581c6481538617";
//On page load
let citiesList;
let countryCodes;

document.addEventListener("DOMContentLoaded", function(){
    document.getElementById('getWeather').addEventListener('click', getWeather);
    document.getElementById('town').addEventListener('keyup', populateSuggestions);
    document.body.addEventListener("click", function(){
        document.getElementById('towns').innerHTML = '';
    });
    getCitiesList(); 
    getCodesList();
});

function getWeather(event){
    event.preventDefault();
    let townField = document.getElementById('town').value;
    let output = '';
    fetch('https://api.openweathermap.org/data/2.5/weather?APPID=' + APIKEY + '&units=metric&q=' + townField)
    .then((res) => res.json())
    .then((data) => { 
            console.log(data);
            document.getElementById('location').innerHTML = "<strong>Weather in " + data.name + ", " + searchCode(data.sys.country) + "</strong>";
            document.getElementById('temperature').innerHTML = "<strong> " + data.main.temp + " °C</strong>";
            document.getElementById('description').innerHTML = "<strong> " + (data.weather[0].description).charAt(0).toUpperCase() + data.weather[0].description.substr(1, data.weather[0].description.length) + "</strong>";
            let windDirection = "";
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
            output = `<tr><td>Wind</td><td>${data.wind.speed} m/s, ${windDirection}</td></tr>
            <tr><td>Humidity</td><td>${data.main.humidity} %</td></tr>
            <tr><td>Pressure</td><td>${data.main.pressure} hpa</td></tr>
            `
            if(data.hasOwnProperty("rain")){
                output += `<tr><td>Rain</td><td>${data.rain["3h"]} mm</td></tr>`
            }
            document.getElementById('weatherData').innerHTML = output;
            document.getElementById('weather-container').style.visibility = "visible";
        });  
    document.getElementById('town').value = "";
}

function populateSuggestions(){
    document.getElementById('towns').innerHTML = '';
    let townField = document.getElementById('town').value;
    let counter = 0;
    let output = '';
        for(var i = 0; i < citiesList.length; i++){
            if(citiesList[i].name.substr(0, townField.length).toUpperCase() === townField.toUpperCase() && townField.length > 0 && !output.includes(citiesList[i].name)){
                output += `<div onclick=\"fillTextbox(this)\"><strong>${citiesList[i].name}</strong><input type=\"hidden\" value=\"${citiesList[i].name}\"></div>`;
                counter++;
            }
            if(counter === 14){
                break;
            }
        }
    document.getElementById('towns').innerHTML = output;
}

function fillTextbox(el){
    document.getElementById('town').value = el.getElementsByTagName('input')[0].value;
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