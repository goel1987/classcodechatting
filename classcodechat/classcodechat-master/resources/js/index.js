const nameInput = document.getElementById(`my-name-input`);
const myMessage = document.getElementById(`myMessage`);
const sendButton = document.getElementById(`sendButton`);
const chatBox = document.getElementById(`chat`);
const MILLISECONDS_IN_TEN_SECONDS = 10000;
const serverURL = `https://it3049c-chat-application.herokuapp.com/messages`;

async function updateMessages() {
  // Fetch Messages
  const messages = await fetchMessages();
  // Loop over the messages. Inside the loop we will:
  // get each message
  // format it
  // add it to the chatbox
  let formattedMessages = ``;
  messages.forEach(message => {
    formattedMessages += formatMessage(message, nameInput.value);
  });
  chatBox.innerHTML = formattedMessages;
}

function formatMessage(message, myNameInput) {
  const time = new Date(message.timestamp);
  const formattedTime = `${time.getHours()}:${time.getMinutes()}`;

  if (myNameInput === message.sender) {
    return `
      <div class="mine messages">
          <div class="message">
              ${message.text}
          </div>
          <div class="sender-info">
              ${formattedTime}
          </div>
      </div>
      `;
  } else {
    return `
          <div class="yours messages">
              <div class="message">
                  ${message.text}
              </div>
              <div class="sender-info">
                  ${message.sender} ${formattedTime}
              </div>
          </div>
      `;
  }
}

setInterval(updateMessages, MILLISECONDS_IN_TEN_SECONDS);

function fetchMessages() {
  return fetch(serverURL)
    .then( response => response.json());
}

function sendMessages (username, text) {
  const newMessage = {
    sender: username,
    text: text,
    timestamp: new Date()
  };

  fetch(serverURL, {
    method: `POST`,
    headers: {
      'Content-Type': `application/json`
    },
    body: JSON.stringify(newMessage)
  });
}
sendButton.addEventListener(`click`, function(sendButtonClickEvent) {
  sendButtonClickEvent.preventDefault();
  const sender = nameInput.value;
  const message = myMessage.value;

  sendMessages(sender,message);
  myMessage.value = ``;
});

// Location and Weather functions
function geoFindMe() {

  async function success(position) {
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;
    let weather;
    try{
      weather = await fetchWeather(latitude, longitude);
      window.alert(`
        ${weather.weather[0].main.toUpperCase()}
        ${weather.weather[0].description}
        Temp: ${Number.parseFloat(weather.main.temp -  273.15).toFixed(2)}°C`
      );
    }
    catch(err){
      window.alert(`Unable to retrieve Weather data !`)
    }
  }

  function error() {
    window.alert(`Unable to retrieve your location`);
  }

  if(!navigator.geolocation) {
    window.alert(`Geolocation is not supported by your browser`);
  } else {
    navigator.geolocation.getCurrentPosition(success, error);
  }

}
function fetchWeather(lat, long) {
  const WEATHER_API = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=YOUR_API_KEY_HERE`;
  return fetch(WEATHER_API)
    .then( response => response.json());
}

document.querySelector(`#find-me`).addEventListener(`click`, geoFindMe);   