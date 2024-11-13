const express = require('express');
const app = express();
const port = 4001;
require('dotenv').config();
const mongoose = require('mongoose');
const mongoURI = process.env.MONGO_URI;
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const socketIo = require('socket.io');
const cors = require('cors');
const http = require('http');

app.use(express.json());
app.use(cors());

// Socket IO CONFIG
const server = http.createServer(app);
const io = socketIo(server,{
  cors: {
    origin: '*',
  }
})

let socketsConnected = new Set();
let users = {};

io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`)
  socketsConnected.add(socket.id);

  socket.on('setUsername', (username) => {
    users[socket.id] = username;
    console.log("List :", users)
    io.emit('updateUserList', users);
  })

  // Gérer coté back end la réception et l’émission des messages
  socket.on('message',(message) => {
    console.log("Message: ", message);
    io.emit('message', message)
  })

  io.emit('clientsTotal', socketsConnected.size);

  socket.on('disconnect', () => {
    console.log(`Client disconnected : ${socket.id}`)
    socketsConnected.delete(socket.id);
    delete users[socket.id];
    io.emit('updateUserList', users);
  });

  



});

// ROUTES CONFIG
const apiRoutes = require('./routes');
const { message } = require('./middlewares/validations/userValidation');
app.use('/api', apiRoutes);

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info : {
          title: 'NodeJS B3',
          version: '1.0',
          description: 'Une API de fou malade',
          contact: {
            name: 'Chris'
          },
          servers : [
            {
              url: 'http://localhost:4001/'
            },
          ],
        },
    },
    apis:[
        `${__dirname}/routes.js`,
        `${__dirname}/routes/*.js`,
        `${__dirname}/models/*.js`,
        `${__dirname}/controller/*.js`,
    ],
}

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));



//Connect to the database
mongoose.connect(mongoURI,{})
.then(()=> console.log('MongoDB connected successfuly'))
.catch(err => console.log(`MongoDB connection error: ${err}`))

app.get('/', (req,res)=> {
    res.send("Hello, bienvenue sur le service");
})


server.listen(port,() =>{
    console.log("Serveur en ligne port 4001")
})