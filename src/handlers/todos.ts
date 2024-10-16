import express from 'express';
import serverless from 'serverless-http';
import { DynamoDbRepository } from '../repositories/dynamo-db.repository'
import { TodoService } from '../services/todo.service';
import { CreateTodoDTO, UpdateTodoDTO } from '../interfaces/todo';
import { DbRepository } from '../interfaces/db-repository';

const app = express();
app.use(express.json());

const dbRepository: DbRepository = new DynamoDbRepository();
const todoService = new TodoService(dbRepository, 'todos');

app.post('/todos', async (req, res) => {
    try {
        const createTodoDTO: CreateTodoDTO = req.body;
        const todo = await todoService.create(createTodoDTO);
        res.status(201).json({ data: todo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating todo' });
    }
});

app.get('/todos', async (req, res) => {
    try {
        const todos = await todoService.findAll();
        res.status(200).json({ data: todos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving todos' });
    }
});

app.get('/todos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const todo = await todoService.findById(id);
        if (!todo) {
            res.status(404).json({ error: 'Todo not found' });
            return;
        }
        res.status(200).json({ data: todo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving todo' });
    }
});

app.put('/todos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updateTodoDTO: UpdateTodoDTO = req.body;
        const todo = await todoService.updateById(id, updateTodoDTO);
        if (!todo) {
            res.status(404).json({ error: 'Todo not found' });
            return;
        }
        res.status(200).json({ data: todo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving todo' });
    }
});


app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await todoService.deleteById(id);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting todo' });
    }
});

const todos = serverless(app);
export { todos };