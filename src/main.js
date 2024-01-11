//Carregando modulos
const mongoose = require('mongoose')
const express = require('express')
const app = express();
const bodyParser  = require('body-parser')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
require('./config/auth')(passport)

const admin = require('./routes/admin')
const usuarios = require('./routes/usuarios')
const tmetric = require('./utils/tmetric')
const omie = require('./utils/omie')

//Configurações
    //Session
    app.use(session({
        secret: 'chave',
        resave: true,
        saveUninitialized: true
    }))

    app.use(passport.initialize())
    app.use(passport.session())

    app.use(flash())
    //Middlewares
    app.use((req, res, next) => {
        //variaveis globais
        res.locals.success_msg = req.flash('success_msg')
        res.locals.error_msg  = req.flash('error_msg')
        res.locals.error = req.flash('Error')
        res.locals.user = req.user || null 
        next()
    })
    //Bodyy Parser
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())

    //Mongoose
    mongoose.Promise = global.Promise;
    // mongodb+srv://api-mern:3qhu1wSeF52E5CLZ@cluster0.lfgjxim.mongodb.net/?retryWrites=true&w=majority
    mongoose.connect('mongodb+srv://api-mern:3qhu1wSeF52E5CLZ@cluster0.lfgjxim.mongodb.net/?retryWrites=true&w=majority').then(() => {
        console.log('conectado ao mongodb!');
    }).catch((err) => {
        console.log('erro: ' + err);
    })

    //public
    app.use(express.static(path.join(__dirname, 'public')))

//Rotas
app.use('/admin', admin)
app.use('/usuarios', usuarios)

//chamada da function de interação com o t metric
tmetric.projetosImport()
//chamada da function de interação com o omie
// omie.omieImports()
//Outros
const port = 8081;

app.listen(port, () => {
    console.log('server on...')
})
