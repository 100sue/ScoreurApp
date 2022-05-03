// Importation du package dotenv sécurisant les informations sensibles liées à la BDD :
// permet de déployer rapidement l'API  
// sécurise notre application Express en application des en-têtes HTTP diverses.
// middleware express lisant l'entrée d'un formulaire, le stockant en tant qu'objet JavaScript accessible via req.body  
// middleware limitant les demandes infructueuses répétées à l'API.
// module donnant accès au chemin du système de fichiers

require('dotenv').config();
const express = require('express');   
const helmet = require('helmet'); 
const bodyParser = require('body-parser'); 
const apiLimiter = require('./middleware/limits-rate'); 
const path = require('path'); 

const userRoutes = require('./routes/userRoutes');        
const postRoutes = require('./routes/postRoutes');        

 
// Création de l'application Express, sécurisée par le package Helmet via la définition d'en-têtes HTTP diverses :

const app = express(); 
app.use(helmet());

// Ajout des headers permettant le Cross Origin Resource Sharing (CORS) :
// Accès autorisé pour tous, Accès autorisé sous certains en-têtes, Accès autorisé sous certaines méthodes.

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');  
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, multipart/form-data'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); 
    next();
  });


app.use(bodyParser.json()); 

// Définition des différentes routes : utilisateur, publications, 
// Route images.

app.use('/api/users', apiLimiter, userRoutes);  
app.use('/api/posts', postRoutes);              
app.use('/images', express.static(path.join(__dirname, 'images')));

// Exportation de l'application

module.exports = app;