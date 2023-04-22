const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Categoria");
const Categoria = mongoose.model("categorias");
require('../models/Postagem');
const Postagem = mongoose.model("postagens");

router.get('/', (req, res) => {
    res.render("admin/index");
});

router.get('/posts', (req, res) => {
    res.send('Pagina de posts');
});

router.get('/categorias', (req, res) => {
    Categoria.find().sort({date: 'desc'}).lean().then((categorias) => {
        res.render('admin/categorias', {categorias: categorias})
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao listar categorias')
        res.redirect('/admin')
    });
});

router.get('/categorias/add', (req, res) => {
    res.render("admin/addcategorias");
});

router.post('/categorias/nova', (req, res) => {
    
    var erros = [];

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"});
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido"});
    }

    if(req.body.nome.length < 2){
        erros.push({texto: "Nome da categoria é muito pequeno"})
    }

    if(erros.length > 0){
        res.render("admin/addcategorias", {erros: erros});
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
    
        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "Categoria criada com sucesso!");
            res.redirect("/admin/categorias");
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar a categoria, tente novamente!");
            res.redirect("/admin");
        });
    }

    
});

router.get("/categorias/edit/:id", (req, res) => {
    Categoria.findOne({_id: req.params.id}).lean().then((categoria) => {
        res.render("admin/editcategorias", {categoria: categoria});
    }).catch((err) => {
        req.flash("error_msg", "Esta categoria não existe");
        res.redirect("/admin/categorias");
    });
    
});

router.post("/categorias/edit", (req, res) => {
    Categoria.findOne({_id: req.body.id}).then((categoria) => {

        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(() => {
            req.flash('success_msg', 'Categoria editada com Sucesso!')
            res.redirect('/admin/categorias')
        }).catch( err => { // ERR: Erro ao salvar::editar
            req.flash('error_msg', 'Houve um erro interno ao editar categoria.')
            res.redirect("/admin/categorias")
        })

    }).catch( err => { // ERR: Não encontrou a categoria
        req.flash('error_msg', 'Houve um erro ao editar categoria.') //Mensagem de Erro
        res.redirect("/admin/categorias")
    })
});

router.post("/categorias/deletar", (req, res) => {
    Categoria.deleteOne({_id: req.body.id}).then(() => {
        req.flash("success_msg", "Categoria deletada com sucesso!");
        res.redirect("/admin/categorias");
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar a categoria");
        res.redirect("/admin/categorias");
    });
});

router.get('/postagens', (req, res) => {
    
    Postagem.find().lean().populate('categoria').sort({data: 'desc'}).then((postagens) => {

        res.render('admin/postagens', {postagens: postagens})

    }).catch( (err) => {

        req.flash('error_msg', 'Erro ao listar os posts')
        res.render('/admin')

    })
    

})

router.get("/postagens/add", (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render("admin/addpostagem", {categorias: categorias});
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar o formulário");
        res.redirect("/admin");
    });
   
});

router.post("/postagens/nova", (req, res) => {
    var erros = []

    if(!req.body.titulo || typeof titulo == undefined || titulo == null) {
        erros.push({texto: 'Titulo inválido'})
    }
    if(!req.body.slug || typeof slug == undefined || slug == null) {
        erros.push({texto: 'Slug inválido'})
    }
    if(!req.body.descricao || typeof descricao == undefined || descricao == null) {
        erros.push({texto: 'Descrição inválido'})
    }
    if(!req.body.conteudo || typeof conteudo == undefined || conteudo == null) {
        erros.push({texto: 'Conteudo inválido'})
    }
    if(!req.body.categoria || typeof categoria == undefined || categoria == null) {
        erros.push({texto: 'Conteudo inválido'})
    }
      

    if(req.body.categoria == "0"){
        erros.push({texto: "Não possui categoria cadastrada!"});
    }

    if(erros.length > 0){
        res.render("admin/addpostagem", {erros: erros});
    }else{
        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        }

        new Postagem(novaPostagem).save().then(() => {
            req.flash("success_msg", "Postagem criada com sucesso!");
            res.redirect("/admin/postagens");
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar postagem!");
            res.redirect("/admin/postagens");
        })

        
    }
});

router.get("/postagens/edit/:id", (req, res) => {
    Postagem.findOne({_id: req.params.id}).lean().then((postagem) => {
        Categoria.find().lean().then((categorias) => {
            res.render("admin/editpostagens", {categorias: categorias, postagem: postagem});
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar as categorias");
            res.redirect("/admin/postagens");
        })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar o formulário de edição");
        res.redirect("/admin/postagens");
    })
   
});

router.post("/postagem/edit", (req, res) => {
    Postagem.findOne({_id: req.body.id}).then((postagem) => {
        
        postagem.titulo = req.body.titulo
        postagem.slug = req.body.slug
        postagem.descricao = req.descricao
        postagem.conteudo = req.body.conteudo
        postagem.categoria = req.body.categoria

        postagem.save().then(() => {
            req.flash("success_msg", "Postagem editada com sucesso!");
            res.redirect("/admin/postagens");
        }).catch((err) => {
            console.log(err)
            req.flash("error_msg", "Erro interno");
            res.redirect("/admin/postagens");
        });
    }).catch((err) => {
        console.log(err)
        req.flash("error_msg", "Houve um erro ao salvar a edição!");
        res.redirect("/admin/postagens");
    });
});

router.get("/postagens/deletar/:id", (req, res) => {
    Postagem.findOneAndDelete({_id: req.params.id}).then(() => {
        res.redirect("/admin/postagens")
    }).catch((err) => {
        req.flash("error_msg"," Houve um erro interno!");
        res.redirect("/admin/postagens");
    })
})

module.exports = router;