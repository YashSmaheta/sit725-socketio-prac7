const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { connectdb, insertData } = require('./data.js');

const app = express();
const http = require('http').createServer(app); // Create HTTP server

const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/submit', async (req, res) => {
    try {
        await insertData(req.body);
        res.status(201).json({ message: 'Form Data Saved!!!!!' });
    } catch (err) {
        console.err('Error while saving form data:', err);
        res.status(500).json({ err: 'Internal Server error' });
    }
});

connectdb().then(() => {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}!`);
    });
});

const io = require('socket.io')(http); 

io.on('connection', (socket) => {
    console.log('a user connected');

    // User added
    socket.emit('hello', 'Hello user this is yash socket, welcome!');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    setInterval(() => {
        socket.emit('number', parseInt(Math.random() * 10));
    }, 1000);

    socket.on('number', (msg) => {
        console.log('Random number: ' + msg);
    });
});

module.exports = app;