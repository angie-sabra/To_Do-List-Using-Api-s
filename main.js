const express = require('express');
const cors = require('cors');
const {
    initialize,
    getTodos,
    addTodo,
    updateTodo,
    deleteTodo
} = require('./sevices/todoService.js');

const app = express();
const PORT = 3000;


app.use(cors());


app.use(express.json());


app.use(express.static('public'));


app.get('/todos', (req, res) => {
    res.json(getTodos());
});

app.post('/todos', (req, res) => {
    const { task, priority } = req.body;

    if (!task || !priority) {
        return res.status(400).json({ message: 'Please provide all required fields: task, priority.' });
    }

    addTodo(task, priority)
        .then(newTodo => {
            res.status(201).json(newTodo);
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
});

app.put('/todos/:task', (req, res) => {
    const { task } = req.params;
    const { priority, completed } = req.body;

    updateTodo(task, { priority, completed })
        .then(updatedTodo => {
            res.json(updatedTodo);
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
});

app.delete('/todos/:task', (req, res) => {
    const { task } = req.params;

    deleteTodo(task)
        .then(() => {
            res.status(204).send();
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
});


initialize().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
