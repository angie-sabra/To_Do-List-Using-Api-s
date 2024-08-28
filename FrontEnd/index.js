function loadTodos() {
    fetch('http://localhost:3000/todos') 
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(todos => {
            todos.forEach(todo => {
                addItemToTheList(todo.task, todo.priority, todo.completed);
            });
        })
        .catch(error => console.error('Error loading todos:', error));
}
const submitButton= document.getElementById("submit");
submitButton.onclick = event => {
    event.preventDefault();
    if (todoInput.value.trim() === "") {
        alert("You didn't enter your to-do list");
        todoInput.value = "";
        todoInput.focus();
        return;
    }

    const task = todoInput.value;
    const priority = selectedPriority.value;

    fetch('http://localhost:3000/todos', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ task, priority })
    })
    .then(response => response.json())
    .then(newTodo => {
        addItemToTheList(newTodo.task, newTodo.priority);
    })
    .catch(error => console.error('Error adding todo:', error));

    todoInput.value = "";
    todoInput.focus();
    selectedPriority.value = "low";
};
