const mongoose = require("mongoose");
const Paiement = mongoose.model(
    "Paiement",
    new mongoose.Schema({
        datePaiement:{type: String,default:new Date().toLocaleString("fr-FR", {timeZone: "Indian/Antananarivo"})},
        vehicule: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicule' }
    })
  );
  module.exports = Paiement;