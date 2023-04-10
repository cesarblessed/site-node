// carregando módulos
const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const admin = require('./routes/admin');
const path = require('path');
const mongoose = require('mongoose');

// Configuração
    // Body Parser
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());
    // Handlebars
    app.engine('handlebars', engine({defaultLayout: 'main'}));
    app.set('view engine', 'handlebars');
    // Mongoose
        mongoose.Promise = global.Promise;    
        mongoose.connect('mongodb://127.0.0.1:27017/blogapp').then(() => {
           console.log("Conectado com sucesso!"); 
        }).catch((err) => {
            console.log("Erro ao se conectar: " + err);
        })
    // Public
        app.use(express.static(path.join(__dirname,"public")));

        app.use((req, res, next) => {
            console.log("Oi eu sou um middleware!");
            next();
        });

        // Rotas

    app.get('/', (req, res) => {
        res.send('Rota principal');
    })

    
    app.get('/posts', (req, res) => {
        res.send('Lista Posts');
    })

    app.use('/admin', admin);
// Outros
const PORT = 6032;
app.listen(PORT, () => {
    console.log("Servidor rodando!");
})