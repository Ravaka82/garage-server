const mongoose = require("mongoose");
const Paiement = mongoose.model(
    "Paiement",
    new mongoose.Schema({
        datePaiement:{type: Date,default: Date.now},
        vehicule: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicule' }
    })
  );
  module.exports = Paiement;