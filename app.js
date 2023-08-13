const express = require('express');
const uuid = require('uuid');

const port = 8000;

const app = express();

app.use(express.json());

const users = [
    {
        id: "0002",
        name: "Conta de teste",
        username: 'teste',
        tasks: [
            {
                id: 'qwertyyuuioo',
                title: 'Tarefa 01',
                done: false,
                deadline: new Date(),
                created_at: new Date(),
            },
            {
                id: 'asdfghjkkkl',
                title: 'Tarefa 02',
                done: false,
                deadline: new Date(),
                created_at: new Date(),
            },
        ]
    },
];

const findUserFromRequestHeaders = (req, res, next) => {
    const headers = req.headers;

    const foundUser = users.find((user) => {
        return user.username === headers.username;
    });

    if(!foundUser) {
        return res.status(400).json({ message: `User with username ${headers.username} not found` });
    }

    req.foundUser = foundUser;
    
    next()
}

const findTaskInsideUser = (req, res, next) => {
    const params = req.params;

    const foundUser = req.foundUser;
    const foundTask = foundUser.tasks.find((task) => {
        return task.id = params.id;
    });

    if(!foundTask) {
        return res.status(400).json({ message: `Task with id ${reqParams.id} not found` });
    };

    req.foundTask = foundTask;

    next()
}

app.get('/teste', (req, res) => {
    res.status(200).json({ message: 'Hello world! Porta aberta.' });
});

app.get('/users', (req, res) => {
    res.status(200).json({ results: users })
});

app.post('/users', (req, res) => {
    const bodyRequest = req.body;

    if(bodyRequest.name === "" || bodyRequest.username === "") {
        return res.status(400).json({ message: `Field name & username are both required!` })
    }
    
    const checkUserName = users.find((user) => {
        return user.username === bodyRequest.username;
    });
    
    if(checkUserName) {
        return res.status(400).json({ message: `User with username ${bodyRequest.username} already exists!` })
    }
    
    const newUser = {
        id: uuid.v4(),
        name: bodyRequest.name,
        username: bodyRequest.username,
        tasks: [],
    }

    users.push(newUser);

    res.status(201).json(newUser);
});

app.use(findUserFromRequestHeaders)

app.get('/tasks', (req, res) => {
    const foundUser = req.foundUser;

    res.status(200).json({ results: foundUser.tasks });
});

app.post('/tasks', (req, res) => {
    const foundUser = req.foundUser;

    const newLocal = req.body;
    const body = newLocal;

    const newTask = {
        id: uuid.v4(),
        title: body.title,
        done: false,
        deadline: new Date(body.deadline),
        created_at: new Date(),
    };

    foundUser.tasks.push(newTask);

    res.status(201).json(newTask);
});

app.get('/tasks/:id', findTaskInsideUser, (req, res) => {
    const foundTask = req.foundTask;

    res.status(200).json(foundTask);
});

app.put('/tasks/:id', findTaskInsideUser, (req, res) => {
    const foundTask = req.foundTask;
    const reqBody = req.body;

    foundTask.title = reqBody.title;
    foundTask.deadline = new Date(reqBody.deadline);

    res.status(200).json(foundTask);
});

app.patch('/tasks/:id', findTaskInsideUser, (req, res) => {
    const foundTask = req.foundTask;

    foundTask.done = !foundTask.done;

    res.status(200).json(foundTask);
})

app.delete('/tasks/:id', (req, res) => {
    const foundUser = req.foundUser;
    const reqParams = req.params;

    const foundTask = foundUser.tasks.findIndex((task) => {
        return task.id === reqParams.id;
    });

    if(foundTask === -1) {
        return res.status(400).json({ message: `Task with id ${reqParams.id} not found` });
    };

    foundUser.tasks.splice(foundTask, 1)

    res.status(204).send({})
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});