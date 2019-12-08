const gWeather = document.getElementById('getWeather');
const townsList = document.getElementById('town');
let gl = 0;
// const historyList = document.getElementById('displayHistory');
const rememberMe = document.getElementById('rememberMe')
  //Check if sth is in localstorage
  const towns = JSON.parse(localStorage.getItem('towns')) || [];

  //Creating the history in localstorage
  function weather(e) {
    e.preventDefault(); 
    const text = (document.getElementById('town')).value;
    const town = {
      text: text, 
    }
    if (!towns.some(e => e.text === text)) {
        towns.push(town);
        localStorage.setItem('towns', JSON.stringify(towns));
        populateList(towns, townsList);
    } 
    console.log(towns);       
  }
 
  //Creating HTML elements
    function populateList(places = [], placeList) {
    placeList.innerHTML = places.map((place, i) => {
        return `
        <div id="city${i}">
            ${place.text}
        </div>
        `;
      
    }).join('');
  }

  //User Preferences saving
  function setDefault (e) {
    e.preventDefault();
    const text = (document.getElementById('town')).value;
    document.getElementById('town').value = text;
    gl = 1;
}


  gWeather.addEventListener('click', weather);
//   populateList(towns, townsList);
  rememberMe.addEventListener('click', setDefault);
  

