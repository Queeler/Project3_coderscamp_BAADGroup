//Constants
const APIKEY = "8ac0c51e406de21860581c6481538617";
//On page load
let citiesList;
let results;

document.addEventListener("DOMContentLoaded", function(){
    document.getElementById('getWeather').addEventListener('click', getWeather);
    document.getElementById('town').addEventListener('keyup', populateSuggestions);
    document.body.addEventListener("click", function(){
        document.getElementById('towns').innerHTML = '';
    });
    getCitiesList();    
});

function getWeather(){
    let townField = document.getElementById('town').value;
    let output = '';
    fetch('https://api.openweathermap.org/data/2.5/weather?APPID=' + APIKEY + '&units=metric&q=' + townField)
    .then((res) => res.json())
    .then((data) => { 
            console.log(data);
            results = []
            document.getElementById('location').innerHTML = "<strong>Weather in " + data.name + ", " + data.sys.country + "</strong>";
            document.getElementById('temperature').innerHTML = "<strong> " + data.main.temp + " °C</strong>";
            document.getElementById('description').innerHTML = "<strong> " + data.weather[0].description + "</strong>"
            output = `<tr><td>Wind</td><td>${data.wind.speed} m/s</td></tr>
            <tr><td>Humidity</td><td>${data.main.humidity} %</td></tr>
            <tr><td>Pressure</td><td>${data.main.pressure} hpa</td></tr>`
//            <tr><td>Rain</td><td>${data.rain["3h"]} mm</td></tr>
//            `
            document.getElementById('weatherData').innerHTML = output;
            results.push(data.name, data.main.temp, data.main.pressure, data.main.humidity);
            
        });  
    document.getElementById('town').value = "";
    
    return results

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

async function getCitiesList(){
    let dataset = await fetchCities();
    citiesList = dataset;
}