const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const db = {};

db.mongoose = mongoose;

db.utilisateur = require("./utilisateur.model");
db.role = require("./role.model");
db.reparation = require("./reparation.model");
db.typeReparation = require("./typeReparation.model");
db.vehicule = require("./vehicule.model");
db.paiement = require("./paiement.model");

db.ROLES = ["client", "responsable_atelier", "responsable_financier"];

module.exports = db;