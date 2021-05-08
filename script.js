// const { URL, URLSearchParams } = require('url');
let interval = null;

document.addEventListener('DOMContentLoaded', (event) => {
  const form = document.getElementById('form');
  form.addEventListener('submit', notifyMe);

  const resetButton = document.getElementById('reset');
  resetButton.addEventListener('click', reset);

  function notifyMe(event) {
    event.preventDefault();
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notification');
    } else if (Notification.permission === 'granted') {
      new Notification('Hi there!');
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(function (permission) {
        if (permission === 'granted') {
          new Notification('Hi there!');
        }
      });
    }

    const pincode = document.getElementById('pincode').value || '';
    const frequency = document.getElementById('interval').value || '';
    const dateString = document.getElementById('date').value || '';
    const date = new Date(dateString);

    const formattedDate =
      date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();

    const display = document.getElementById('display');
    display.innerHTML = `<span>Fetching slots for <b>date:</b> ${formattedDate}, <b>pincode:</b> ${pincode}..</span>`;
    const loader = document.getElementById('hourglass');
    loader.setAttribute('class', 'hourglass show');
    const button = document.getElementById('button');
    button.setAttribute('disabled', true);

    interval = setInterval(
      () => checkForSlots(pincode, dateString ? formattedDate : null),
      frequency * 1000
    );
  }

  function checkForSlots(pincode, date) {
    const url = new URL(
      'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin'
    );
    const params = { pincode, date };
    url.search = new URLSearchParams(params).toString();

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const outputDisplay = document.getElementById('output-display');
        const { sessions = [], centers = [] } = data;

        const hasCentersWithSlots = centers.some(
          (center) =>
            center.sessions &&
            center.sessions.length &&
            center.sessions.some((session) => session.available_capacity > 0)
        );

        const hasSessionsWithSlots = sessions.some(
          (session) => session.available_capacity > 0
        );

        if (hasCentersWithSlots || hasSessionsWithSlots) {
          outputDisplay.innerHTML = `<span>Slots available. <b>Pincode:</b> ${pincode}..</span>`;
          playAudio();
          if (!('Notification' in window)) {
            alert('This browser does not support desktop notification');
          } else if (Notification.permission === 'granted') {
            new Notification('Slots are available..');
          }
        } else {
          outputDisplay.innerHTML = `<span>Slots not available.`;
          pauseAudio();
        }

        const timestamp = document.getElementById('timestamp-display');
        timestamp.innerHTML = `<span>Last fetched at ${new Date().toTimeString()}</span>`;
      });
  }

  function reset(event) {
    event.preventDefault();
    clearInterval(interval);
    interval = null;

    document.getElementById('pincode').value = '';
    document.getElementById('interval').value = 5;
    document.getElementById('date').value = '';
    document.getElementById('output-display').innerHTML = '';
    document.getElementById('display').innerHTML = '';
    const loader = document.getElementById('hourglass');
    loader.setAttribute('class', 'hourglass');

    const button = document.getElementById('button');
    button.removeAttribute('disabled');
  }
});

function playAudio() {
  var x = document.getElementById('myAudio');
  x.play();
}

function pauseAudio() {
  var x = document.getElementById('myAudio');
  x.pause();
}
