const mongoose = require("mongoose");
const moment = require('moment-timezone');
const Vehicule = mongoose.model(
    "Vehicule",
    new mongoose.Schema({
        nom: {type: String, required: true},
        type : {type: String, required: true},
        image : {type: String},
        immatriculation : {type: String, required: true},
        dateDebut: {type: String, default: new Date().toLocaleString("fr-FR", {timeZone: "Indian/Antananarivo"})},
        DateHeureFin: {type: String, default: ""},
        totalTempsReparation: {type: String, default:""},
        totalPrixReparation: {type: Number, default: 0},
        status : {type: String, default: "non valider"},
        utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' }
    })
  );
  module.exports = Vehicule;
