const mongoose = require("mongoose");
const Reparation = mongoose.model(
    "Reparation",
    new mongoose.Schema({
        dateHeureDebut: {type: String,default:""},
        dateHeureFin: {type: String,default:""},
        tempsReparation: {type:String,default:""},
        statusUneReparation: {type: String, default:"à faire"},
        typeReparation: { type: mongoose.Schema.Types.ObjectId, ref: 'TypeReparation' },
        vehicule: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicule' },
    })
  );
  module.exports = Reparation;