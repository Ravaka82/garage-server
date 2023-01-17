const mongoose = require("mongoose");
const Reparation = mongoose.model(
    "Reparation",
    new mongoose.Schema({
        avancement:{type: Number},
        statusUneReparation: {type: Boolean},
        typeReparation: { type: mongoose.Schema.Types.ObjectId, ref: 'TypeReparation' },
        vehicule: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicule' },
    })
  );
  
  module.exports = Reparation;