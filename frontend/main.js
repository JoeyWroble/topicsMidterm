const api = 'http://127.0.0.1:8000/todos';

document.getElementById('save-new-todo').addEventListener('click', (e) => {
  e.preventDefault();
  postTodo();
  const closeBtn = document.getElementById('add-close');
  closeBtn.click();
});

const postTodo = () => {
  const titleInput = document.getElementById('new-title');
  const title = titleInput.value;
  const descInput = document.getElementById('new-description');
  const desc = descInput.value;

  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 201) {
      getTodos();
    }
  };

  xhr.open('POST', api, true);
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.send(JSON.stringify({ title, desc }));
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
    return `<tr>
        <td>${x.id}</td>
        <td>${x.title}</td>
        <td>${x.desc}</td>
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