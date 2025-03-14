const api = 'http://127.0.0.1:8000/sleeps';

document.getElementById('save-new-sleep').addEventListener('click', (e) => {
  e.preventDefault();
  postSleep();
  const closeBtn = document.getElementById('add-close');
  closeBtn.click();
});

const formatTime = (time) => {
  const [hour, minute] = time.split(':');
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minute} ${ampm}`;
};

const calculateSleepDuration = (timeToSleep, timeAwake) => {
  const [sleepHour, sleepMinute] = timeToSleep.split(':').map(Number);
  const [awakeHour, awakeMinute] = timeAwake.split(':').map(Number);

  let sleepDate = new Date();
  sleepDate.setHours(sleepHour, sleepMinute, 0);

  let awakeDate = new Date();
  awakeDate.setHours(awakeHour, awakeMinute, 0);

  if (awakeDate < sleepDate) {
    awakeDate.setDate(awakeDate.getDate() + 1);
  }

  const duration = awakeDate - sleepDate;
  const durationHours = Math.floor(duration / (1000 * 60 * 60));
  const durationMinutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));

  return `${durationHours} hours and ${durationMinutes} minutes`;
};

const postSleep = () => {
  const dateInput = document.getElementById('date');
  const date = dateInput.value;
  const timeToSleepInput = document.getElementById('timeToSleep');
  const timeToSleep = timeToSleepInput.value;
  const timeAwakeInput = document.getElementById('timeAwake');
  const timeAwake = timeAwakeInput.value;

  if (date && timeToSleep && timeAwake) {
    const sleepDuration = calculateSleepDuration(timeToSleep, timeAwake);

    const card = document.createElement('div');
    card.className = 'col-md-4';
    card.innerHTML = `
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">Date: ${date}</h5>
                <p class="card-text">Went to Bed At: ${timeToSleep}</p>
                <p class="card-text">Woke Up At: ${timeAwake}</p>
                <p class="card-text">Slept For: ${sleepDuration}</p>
            </div>
        </div>
    `;

    document.getElementById('card-rows').appendChild(card);

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 201) {
        getSleeps();
      }
    };

    xhr.open('POST', api, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify({ date, timeToSleep, timeAwake }));
  }
};

const deleteSleep = (id) => {
  console.log(`deleting sleep ID=${id}`);
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      getSleeps();
      console.log(`deleted sleep ID=${id}`);
    }
  };

  xhr.open('DELETE', `${api}/${id}`, true);
  xhr.send();
};

const displaySleeps = (sleeps) => {
  const cardRows = document.getElementById('card-rows');
  cardRows.innerHTML = '';
  sleeps.forEach((x) => {
    const sleepDuration = calculateSleepDuration(x.timeToSleep, x.timeAwake);
    const card = document.createElement('div');
    card.className = 'col-md-4';
    card.innerHTML = `
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title"><strong>${x.date}</h5>
                <p class="card-text">Went to Bed At: ${formatTime(x.timeToSleep)}</p>
                <p class="card-text">Woke Up At: ${formatTime(x.timeAwake)}</p>
                <p class="card-text">Slept For: ${sleepDuration}</p>
                <button onClick="deleteSleep(${x.id})" type="button" class="btn btn-danger">Delete</button>
            </div>
        </div>
    `;
    cardRows.appendChild(card);
  });
};

const getSleeps = () => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      const data = JSON.parse(xhr.responseText);
      console.log(data);
      displaySleeps(data);
    }
  };

  xhr.open('GET', api, true);
  xhr.send();
};

(() => {
  getSleeps();
})();