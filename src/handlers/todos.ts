import express from 'express';
import serverless from 'serverless-http';
import { TodoService } from '@services/todo.service';
import { CreateTodoDTO } from '@dto/create-todo.dto';
import { UpdateTodoDTO } from '@dto/update-todo.dto';
import { Logger } from '@aws-lambda-powertools/logger';
import { Tracer } from '@aws-lambda-powertools/tracer';
import middy from '@middy/core';
import { captureLambdaHandler } from '@aws-lambda-powertools/tracer/middleware';

const app = express();
app.use(express.json());

const logger = new Logger();
const tracer = new Tracer();

const todoService = new TodoService();

app.post('/todos', async (req, res) => {
    try {
        const createTodoDTO: CreateTodoDTO = req.body;
        const todo = await todoService.create(createTodoDTO);
        res.status(201).json({ data: todo });
    } catch (error) {
        logger.error('Error creating todo', { error });
        res.status(500).json({ error: 'Error creating todo' });
    }
});

app.get('/todos', async (req, res) => {
    try {
        const todos = await todoService.findAll();
        res.status(200).json({ data: todos });
    } catch (error) {
        logger.error('Error retrieving todos', { error });
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
        logger.error('Error retrieving todo', { id, error });
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
        logger.error('Error updating todo', { id, error });
        res.status(500).json({ error: 'Error retrieving todo' });
    }
});


app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await todoService.deleteById(id);
        res.status(204).send();
    } catch (error) {
        logger.error('Error deleting todo', { id, error });
        res.status(500).json({ error: 'Error deleting todo' });
    }
});

const todosHandler = serverless(app);
export const todos = middy(todosHandler).use(captureLambdaHandler(tracer));

