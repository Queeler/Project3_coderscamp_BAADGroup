//Speech synthesis - actual weather conditions

const speakButton = document.querySelector('#readWeather');
function toggle (){
  const msg = new SpeechSynthesisUtterance();
  msg.lang = 'en-US'
  msg.text = `Weather for today for the city of CITY. At present the temperature is DEGREES °C and the pressure is PRESSURE hektopascals. The air humidity is HUMIDITY percent. Today's minimum temperature is MINIMUM °C and the maximum temperature is MAXIMUM °C.`;
  
  speechSynthesis.speak(msg);
}

speakButton.addEventListener('click', toggle);
