const { Socket } = require('dgram');
const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');

const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname,'public')));
app.set('views',path.join(__dirname,'Paginas'));
app.engine('html',require('ejs').renderFile);
app.set('view engine','html');

app.get('/',(req,res)=>{
    res.render('index.html')
})

app.post('/acessar',(req,res)=>{
    let Usuario = req.body.usuario;
    res.render('chat.html',{Usuario: Usuario})
})

let messages = []

io.on('connection',Socket =>{
    console.log(`Socket conectado: ${Socket.id}`)

    Socket.emit('previousMessages',messages)

    Socket.on('sendMessage', data =>{
        messages.push(data);
        Socket.broadcast.emit('receivedMessage',data);
    })
})

server.listen(3000,'192.168.0.15');