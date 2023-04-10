// carregando módulos
const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const admin = require('./routes/admin');
const path = require('path');
const mongoose = require('mongoose');
const session = require("express-session");
const flash = require("connect-flash");

// Configuração
    // Sessão
        app.use(session({
            secret: "cursodenode",
            resave: true,
            saveUninitialized: true
        }));

        app.use(flash());

    // Middleware
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash("success_msg");
        res.locals.error_msg = req.flash("error_msg");
        next();
    });

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

    // Middlewares
       /* app.use((req, res, next) => {
            console.log("Oi eu sou um middleware!");
            next();
        });*/

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