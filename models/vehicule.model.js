const mongoose = require("mongoose");
const Vehicule = mongoose.model(
    "Vehicule",
    new mongoose.Schema({
        nom: {type: String, required: true},
        type : {type: String, required: true},
        image : {type: String},
        immatriculation : {type: String, required: true},
        dateDebut: {type: Date, default: Date.now},
        totalAvancement: {type: Number, default: 0},
        totalPrixReparation: {type: Number, default: 0},
        status : {type: String, default: "non valider"},
        utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' }
    })
  );
  
  module.exports = Vehicule;
