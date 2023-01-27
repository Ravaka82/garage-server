const mongoose = require("mongoose");
const Reparation = mongoose.model(
    "Reparation",
    new mongoose.Schema({
        dateHeureDebut: {type: Date,default: 0},
        dateHeureFin: {type: Date,default: 0},
        tempsReparation: {type:String,default:""},
        statusUneReparation: {type: String, default:"à faire"},
        typeReparation: { type: mongoose.Schema.Types.ObjectId, ref: 'TypeReparation' },
        vehicule: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicule' },
    })
  );
  module.exports = Reparation;