/*Configuration d'express*/
const express = require('express');
var app = express();
app.use(express.static('public'));

/*Configuration de body parser*/
const bodyParser= require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

/* on associe le moteur de vue au module «ejs» */
app.set('view engine', 'ejs'); // générateur de template
const MongoClient = require('mongodb').MongoClient;

////////////////////////////////// route accueil
app.get('/', function (req, res) {
	// affiche le contenu du gabarit accueil
	res.render('gabarit-accueil.ejs');
})

////////////////////////////////// route membres
app.get('/membres', function (req, res) {
	var cursor = db.collection('adresse').find().toArray(function(err, resultat){
		if (err) return console.log(err)
		var util = require("util");
 		console.log('util = ' + util.inspect(resultat));
		// affiche le contenu de la BD
		res.render('gabarit-membres.ejs', {adresses: resultat})
	}) 
})

let db // variable qui contiendra le lien sur la BD

////////////////////////////////// route formulaire
app.get('/formulaire', function (req, res) {
	// affiche le contenu du gabarit accueil
	res.render('gabarit-formulaire.ejs');
})

//////////////////////////////// route ajouter
app.post('/ajouter', (req, res) => {
	db.collection('adresse').save(req.body, (err, result) => {
		if (err) return console.log(err)
		console.log('sauvegarder dans la BD')
		res.redirect('/membres')
	})
})

/*Connexion à la base de données MongoDB*/
MongoClient.connect('mongodb://127.0.0.1:27017', (err, database) => {
	if (err) return console.log(err)
	db = database.db('carnet_adresse')
	// lancement du serveur Express sur le port 8081
	app.listen(8081, () => {
		console.log('connexion à la BD et on écoute sur le port 8081')
	})
})