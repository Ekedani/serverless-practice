import express from 'express';
import serverless from 'serverless-http';

const app = express();
app.use(express.json());

app.post('/todos', async (req, res) => {
    
});

app.get('/todos', async (req, res) => {
    
});

app.get('/todos/:id', async (req, res) => {
    
});

app.put('/todos/:id', async (req, res) => {
    
});


app.delete('/todos/:id', async (req, res) => {
    
});

const todos = serverless(app);
export { todos };