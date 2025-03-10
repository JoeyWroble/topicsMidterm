const api = 'http://127.0.0.1:8000/todos';

document.getElementById('save-new-todo').addEventListener('click', (e) => {
  e.preventDefault();
  postTodo();
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

const postTodo = () => {
  const dateInput = document.getElementById('date');
  const date = dateInput.value;
  const timeToSleepInput = document.getElementById('timeToSleep');
  const timeToSleep = timeToSleepInput.value;
  const timeAwakeInput = document.getElementById('timeAwake');
  const timeAwake = timeAwakeInput.value;


  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 201) {
      getTodos();
    }
  };

  xhr.open('POST', api, true);
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.send(JSON.stringify({ date, timeToSleep, timeAwake }));
};

const deleteTodo = (id) => {
  console.log(`deleting todo ID=${id}`);
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      getTodos();
      console.log(`deleted todo ID=${id}`);
    }
  };

  xhr.open('DELETE', `${api}/${id}`, true);
  xhr.send();
};

const displayTodos = (todos) => {
  const tbody = document.getElementById('todo-rows');
  tbody.innerHTML = '';
  const rows = todos.map((x) => {
    const sleepDuration = calculateSleepDuration(x.timeToSleep, x.timeAwake);
    return `<tr>
        <td>${x.id}</td>
        <td>${x.date}</td>
        <td>${formatTime(x.timeToSleep)}</td>
        <td>${formatTime(x.timeAwake)}</td>
        <td>${sleepDuration}</td>
        <td>
        <button onClick="deleteTodo(${x.id})" type="button" class="btn btn-danger">Delete</button>
        </td>
    </tr>`;
  });
  tbody.innerHTML = rows.join(' ');
};

const getTodos = () => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      data = JSON.parse(xhr.responseText);
      console.log(data);
      displayTodos(data);
    }
  };

  xhr.open('GET', api, true);
  xhr.send();
};

(() => {
  getTodos();
})();