//Constants
const APIKEY = "8ac0c51e406de21860581c6481538617";
//On page load
document.addEventListener("DOMContentLoaded", function(){
    document.getElementById('getWeather').addEventListener('click', getWeather);

    fetch('cityList.json')
    .then((res) => res.json())
    .then((data) => {
        let output = '';
        data.forEach(function(town){
            output += `<option class="opstyle" value=\"${town.name}\">`;
        });
        document.getElementById('towns').innerHTML = output;
    });
});

function getWeather(){
    let town = document.getElementById('town').value;
    fetch('https://api.openweathermap.org/data/2.5/weather?APPID=' + APIKEY + '&units=metric&q=' + town)
    .then((res) => res.json())
    .then((data) => console.log(data));
}