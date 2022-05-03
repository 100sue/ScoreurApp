const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
const db = require('../database');
const User = require('../models/user');
require('dotenv').config();


// Enregistrement d'un nouvel utilisateur :
// Hashage du mot de passe via Bcrypt (10 passages).
// Sauvegarde du nouvel utilisateur dans la base de données SQL

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            db.query(`INSERT INTO utilisateurs (nom, prenom, email, password, image) VALUES ('${req.body.nom}', '${req.body.prenom}', '${req.body.email}', '${hash}', '')`, (error, result) => {
            if (error) {
                return res.status(400).json("Erreur, utilisateur non créé !")
            } else {
                return res.status(201).json({ message: 'Utilisateur créé !'})
            };
        })
    })
} 

// Connexion d'un utilisateur existant  :
// Recherche de l'utilisateur via son mail.
// Utilisation de bcrypt pour comparer le hashage du mot de passe.
// Si le mot de passe ne correspond pas, envoi d'un message d'erreur
// Si le mot de passe correspond :
// Vérification du niveau d'accès de l'utilisateur afin de lui attribuer le statut d'admin ou de membre.
// Attribution d'un token d'identification d'une durée de 24h
// Si l'utilisateur ou le mot de passe n'ont pas été trouvés, envoi d'un message d'erreur


exports.login = (req, res, next) => {
    const email = req.body.email;
	const password = req.body.password;
    if (email && password) {
        db.query('SELECT * FROM utilisateurs WHERE email= ?', email, (error, results, fields) => { 
            if (results.length > 0) {
                bcrypt.compare(password, results[0].password).then((valid) => {
                    if (!valid) {
                    res.status(401).json({ message: 'Mot de passe incorrect' })
                    } else {
                    let status = ''
                        if (results[0].niveau_acces === 1) {
                            status = 'admin'
                        } else {
                            status = 'membre'
                        }
                        res.status(200).json({
                            userId: results[0].id,
                            email: results[0].email,
                            status: status,
                            token: jwt.sign({ userId: results[0].id, status: status },process.env.JWT_SECRET_TOKEN,{ expiresIn: '24h' })
                        })
                    }
                })
            } 
            else {
                res.status(401).json({ message: 'Utilisateur ou mot de passe inconnu' })
            }
        })
    } else {  
        res.status(400).json({ message: "Entrez votre email et votre mot de passe" })
    }
}   

// Modification de compte - Data :

exports.updateUser = (req, res, next) => {
    db.query(`UPDATE utilisateurs SET nom=?, prenom=?, email=?, image=? WHERE id = ?`, [req.body.nom, req.body.prenom, req.body.email, req.body.image, req.params.id], (error, result) => {
        if (error) {
            return res.status(400).json({ error: "Le compte n'a pas pu être modifié" })
        }
        return res.status(200).json(result);
    })
}

// Modification de compte - Avatar (image) :

exports.updateUserImage = (req, res, next) => {
    db.query(`UPDATE utilisateurs SET image=? WHERE id=?`, [req.file.path, req.params.id], (error) => {
        if (error) {
            return res.status(400).json({ error: "Photo de profil mise à jour" }) 
        }
        return res.status(200).json(req.file);
    })
}

// Suppression d'un compte :
// Recherche de l'utilisateur via son id avant suppresion.
// Si l'utilisateur n'a pas été trouvé : erreur.
// Si l'id correspond, suppresion du compte.

exports.deleteUser = (req, res, next) => {
    const id = req.params.id;
    db.query(`DELETE FROM utilisateurs WHERE id = ?`, id, (error, result) => {
        if (error) {
            return res.status(400).json({ error: 'Utilisateur non trouvé'}); 
        }
        return res.status(204).end();
    });
};


// Sélectionner un utilisateur :
// Si l'utilisateur n'a pas été trouvé.
// Si l'id correspond, affichage du compte

exports.getOneUser = (req, res, next) => {
    const id = req.params.id;
    db.query(`SELECT * FROM utilisateurs WHERE id = ?`, id, (error, result) => {
        if (error) {
            return res.status(400).json({ error: 'Utilisateur non trouvé'}); 
        }
        return res.status(200).json(result[0]);
    });
};


// Récupérer l'intégralité des membres inscrits :
// Si les utilisateurs n'ont pas été trouvés.
// Si les utilisateurs ont été trouvés, affichage de tous les comptes.

exports.getAllUsers = (req, res, next) => {
    db.query(`SELECT * FROM utilisateurs`, (error, result) => {
        if (error) {
            return res.status(400).json({ error: 'Utilisateur non trouvé'}); 
        }
        return res.status(200).json(result);
    });
};