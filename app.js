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

/*Permet d'accéder à l’index  automatique  « _id »*/
const ObjectID = require('mongodb').ObjectID;

let db // variable qui contiendra le lien sur la BD

////////////////////////////////// route accueil
app.get('/', function (req, res) {
	// affiche le contenu du gabarit accueil
	res.render('accueil.ejs');
})

////////////////////////////////// route adresses
app.get('/list', function (req, res) {
	var cursor = db.collection('adresse').find().toArray(function(err, resultat){
		if (err) return console.log(err)
		var util = require("util");
 		console.log('util = ' + util.inspect(resultat));
		// affiche le contenu de la BD
		res.render('composants/adresses.ejs', {adresses: resultat})
	}) 
})

////////////////////////////////// route formulaire
app.get('/formulaire', function (req, res) {
	// affiche le contenu du gabarit accueil
	res.render('gabarit-formulaire.ejs');
})

//////////////////////////////// route ajouter
app.post('/ajouter', (req, res) => {
	console.log(req.body._id)
	if(req.body._id ==""){
		console.log("nouveau");
		let objet ={
			nom:req.body.nom,
			prenom:req.body.prenom,
			courriel: req.body.courriel,
			telephone:req.body.telephone
		}
		db.collection('adresse').save(objet, (err, result) => {
		if (err) return console.log(err)
			console.log('sauvegarder dans la BD')
			res.redirect('/list')
		})
	}else{
		console.log("modifier");
		let objet = {
			_id: ObjectID(req.body._id),
			nom:req.body.nom,
			prenom:req.body.prenom,
			courriel: req.body.courriel,
			telephone:req.body.telephone
		}
		db.collection('adresse').save(objet, (err, result) => {
		if (err) return console.log(err)
		console.log('sauvegarder dans la BD')
		res.redirect('/list')
	})
	}
	
})

app.get('/delete/:id', (req, res) => {
var id = req.params.id 
var critere = ObjectID(req.params.id)
console.log(critere)

console.log(id)
 db.collection('adresse')
 .findOneAndDelete({"_id": critere}, (err, resultat) => {

if (err) return console.log(err)
 res.redirect('/list')
 })
})

app.get('/trier/:cle/:ordre', (req, res) => {
	let cle = req.params.cle
	let ordre = (req.params.ordre == 'asc' ? 1 : -1)
	let cursor = db.collection('adresse').find().sort(cle,ordre).toArray(function(err, resultat){
		ordre = !ordre;
		res.render('composants/adresses.ejs', {adresses: resultat, cle, ordre})
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