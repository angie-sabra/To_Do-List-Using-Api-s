const ExcelJS = require('exceljs');

let workbook = new ExcelJS.Workbook();
let worksheet;
let todos = [];

async function initialize() {
    try {
        await workbook.xlsx.readFile('todos.xlsx');
        worksheet = workbook.getWorksheet('ToDos');
        if (!worksheet) {
            worksheet = workbook.addWorksheet('ToDos');
        }
    } catch (error) {
        console.log('File does not exist, creating a new one.');
        worksheet = workbook.addWorksheet('ToDos');
    }

    worksheet.columns = [
        { header: 'Task', key: 'task', width: 50 },
        { header: 'Priority', key: 'priority', width: 10 },
        { header: 'Completed', key: 'completed', width: 10 }
    ];

    worksheet.getRow(1).font = { bold: true };

    loadTodosFromWorksheet();
}

function loadTodosFromWorksheet() {
    todos = [];
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber === 1) return; 
        const todo = {
            task: row.getCell('A').value,
            priority: row.getCell('B').value,
            completed: row.getCell('C').value === 'true' 
        };
        todos.push(todo);
    });
}

function addTodo(task, priority) {
    const newTodo = { task, priority, completed: false };
    todos.push(newTodo);
    worksheet.addRow(newTodo);

    return workbook.xlsx.writeFile('todos.xlsx')
        .then(() => newTodo)
        .catch(err => {
            throw new Error('Error saving the task to the file: ' + err.message);
        });
}

function updateTodo(task, updatedDetails) {
    let todo = todos.find(t => t.task === task);

    if (!todo) {
        throw new Error('Task not found');
    }

    todo.priority = updatedDetails.priority || todo.priority;
    todo.completed = updatedDetails.completed !== undefined ? updatedDetails.completed : todo.completed;

    worksheet.eachRow((row, rowNumber) => {
        if (row.getCell('A').value === task) {
            row.getCell('B').value = todo.priority;
            row.getCell('C').value = todo.completed ? 'true' : 'false';
        }
    });

    return workbook.xlsx.writeFile('todos.xlsx')
        .then(() => todo)
        .catch(err => {
            throw new Error('Error updating the task in the file: ' + err.message);
        });
}

function deleteTodo(task) {
    const todoIndex = todos.findIndex(t => t.task === task);

    if (todoIndex === -1) {
        throw new Error('Task not found');
    }

    todos.splice(todoIndex, 1);
    worksheet.spliceRows(todoIndex + 2, 1); 

    return workbook.xlsx.writeFile('todos.xlsx')
        .catch(err => {
            throw new Error('Error deleting the task from the file: ' + err.message);
        });
}

module.exports = {
    initialize,
    getTodos: () => todos,
    addTodo,
    updateTodo,
    deleteTodo
};
