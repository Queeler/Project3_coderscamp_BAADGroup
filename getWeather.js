//Constants
const APIKEY = "8ac0c51e406de21860581c6481538617";
//On page load
let citiesList;

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
    fetch('https://api.openweathermap.org/data/2.5/weather?APPID=' + APIKEY + '&units=metric&q=' + townField)
    .then((res) => res.json())
    .then((data) => console.log(data));
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