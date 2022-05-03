// Importation mysql 
const mysql = require('mysql');

// Création du modèle user :

const User = function (user) {
    this.id = user.id;
    this.nom = user.nom;
    this.prenom = user.prenom;
    this.email = user.email;
    this.password = user.password;
}

module.exports = User;