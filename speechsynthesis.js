//Speech synthesis - actual weather conditions
let Data;
const speakButton = document.querySelector('#readWeather');
function toggle (){
  Data = testData;
  console.log(Data);
  const msg = new SpeechSynthesisUtterance();
  msg.lang = 'en-US'
  msg.text = `Weather for today for the city of ${Data[0]}. The temperature is ${Data[1]} °C and the pressure is ${Data[2]} hektopascals. The air humidity is ${Data[3]} percent.`;
  speechSynthesis.speak(msg);
}

speakButton.addEventListener('click', toggle);
