// carregando módulos
const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const admin = require('./routes/admin');
const path = require("path");
// const mongoose = require('mongoose');
// Configuração
    // Body Parser
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());
    // Handlebars
    app.engine('handlebars', engine({defaultLayout: 'main'}));
    app.set('view engine', 'handlebars');
    // Mongoose
    
    // Public
        app.use(express.static(path.join(__dirname,"public")));
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