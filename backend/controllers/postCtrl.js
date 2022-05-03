// Importation du modèle de publications.
// Importation de la fonction fs permettant de supprimer un fichier.
// Importation de la BDD.

const Post = require('../models/post')
const fs = require('fs');
const db = require('../database'); 


// Création d'une nouvelle publication :
// Vérification post.
// Contenu de la publication, si la publication contient une image, paramètrage de l'url.
// Puis, préparation de la requête SQL.
// Envoi de la requête à la BDD en vérifiant le statut de l'utilisateur et maj de l'odre des posts.


exports.createPost = (req, res, next) => {
    if (!req.body.message){
        res.status(400).json({ message: "Erreur lors de la création de la publication !" });
        return
    }
    let media = null;
        if (req.file && req.file.filename !== undefined) {
            media = `/images/${req.file.filename}`;
        }
        let sqlCreatePost = `INSERT INTO publications (utilisateur_id, message, media, link, date_ajout) VALUES (?, ?, ?, ?, NOW())`;
        db.execute(sqlCreatePost, [req.userId, req.body.message, media, req.body.link], (error, publication) => {
            if (!error) {
                db.query(`SELECT publications.*, utilisateurs.nom, utilisateurs.prenom, utilisateurs.image,
                IF(publications.utilisateur_id = ${req.userId} OR "${req.status}" = "admin", 1, 0) AS editable 
                FROM publications JOIN utilisateurs ON publications.utilisateur_id = utilisateurs.id WHERE publications.id = LAST_INSERT_ID()`,(error, publication) => {
                    res.status(201).json(publication[0]);
                })
                } else {
                    res.status(400).json({ message: "Erreur lors de la création de la publication !" });
                }
            });
};



// Modification d'une publication :
// Si la publication contient une image, paramètrage de l'url
// Mise à jour de la publication .

exports.updatePost = (req, res, next) => {
    let media = req.body.media;
    let message = req.body.message || '';
    let link = req.body.link || '';
    if (req.file && req.file.filename !== undefined) {
        media = `/images/${req.file.filename}`;
    } 
    db.query(`UPDATE publications SET message=?, media=?, link=? WHERE id = ?`, [message, media, link,req.params.id], (error, result) => {
        if (error) {
            return res.status(400).json({ error: "Le post n'a pas pu être modifié" })
        }
        return res.status(200).json(result);
    })
};

// Suppression d'une publication :
// Supprimer l'image si elle existe du post (delete dans le dossier images).
// Recherche de la publication via son id avant suppression.
// Si la publication n'a pas été trouvée, si l'id correspond, suppresion de la publication

exports.deletePost = (req, res, next) => {
    const id = req.params.id;
    db.query(`SELECT media FROM publications WHERE id = ${id}`, (error, result) => {
        if (result.length && result[0].media) {
            fs.unlink(__dirname + '/../' +result[0].media, () => {})
        }
    });
    db.query(`DELETE FROM publications WHERE id = ?`, id, (error, result) => {
        if (error) {
            return res.status(400).json({ error: 'Publication non trouvée' });
        }
        return res.status(204).end();
    });
};

// Récupération d'une publication :
// Si la publication n'a pas été trouvée.
 // Si l'id correspond, affichage de la publication.

exports.getOnePost = (req, res, next) => {
    const id = req.params.id;
    db.query(`SELECT * FROM publications INNER JOIN utilisateurs ON utilisateurs.id = publications.utilisateur_id WHERE publications.id = ?`, id, (error, result) => {
        if (error) {
            return res.status(400).json({ error: 'Publication non trouvée' });
        }
        return res.status(200).json(result[0]);
    });
};

// Récupération de l'intégralité des publications : 
// Si les publications n'ont pas été trouvées.
// Si les publications ont été trouvées, affichage de tous les posts

exports.getAllPosts = (req, res, next) => {
    db.query(`SELECT publications.*, utilisateurs.nom, utilisateurs.prenom, utilisateurs.image,
    (SELECT COUNT(*) FROM likes WHERE publication_id = publications.id) AS likes,
    IF(publications.utilisateur_id = ${req.userId} OR "${req.status}" = "admin", 1, 0) AS editable
    FROM publications JOIN utilisateurs ON publications.utilisateur_id = utilisateurs.id
    ORDER BY date_ajout desc`, (error, result) => {
        if (error) {
            return res.status(400).json({ error: 'Publications non trouvées' });
        }
        return res.status(200).json(result);
    });
};