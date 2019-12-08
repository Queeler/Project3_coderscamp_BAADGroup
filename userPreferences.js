const addItems = document.getElementById('getWeather');
const townsList = document.getElementById('town');
const rememberMe = document.getElementById('rememberMe')
  //Check if sth is in localstorage
  const towns = JSON.parse(localStorage.getItem('towns')) || [];

  //Creating the history in localstorage
  function addItem(e) {
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
  
  //Create the actual html
  
  function populateList(places = [], placeList) {
    placeList.innerHTML = places.map((place, i) => {
      return `
      <div>
        <input data-index=${i} id="city${i} ${place.done ? 'checked': ''}"/>
        <label for="city
        ${i}">${place.text}</label>
      </div>
      `;
    }).join('');
  }
  function setDefault (e) {
    e.preventDefault();
    const text = (document.getElementById('town')).value;
 
    townsList.setAttribute("placeholder", text )
}


  addItems.addEventListener('click', addItem);
//  populateList(towns, townsList);
  rememberMe.addEventListener('click', setDefault);
  

