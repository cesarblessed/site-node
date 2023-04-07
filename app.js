// carregando módulos
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
// const mongoose = require('mongoose');
// Configuração
    // Body Parser
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());
    // Handlebars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}));
        app.set('view engine', 'handlebars');
    // Mongoose
    
// Rotas

// Outros
const PORT = 6032;
app.listen(PORT, () => {
    console.log("Servidor rodando!");
})