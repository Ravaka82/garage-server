const mongoose = require("mongoose");
const TypeReparation = mongoose.model(
    "TypeReparation",
    new mongoose.Schema({
        nomTypeReparation:{type: String},
        description: {type: String},
        image: { type: String},
        prixReparation: { type: Number },
    })
  );
  
  module.exports = TypeReparation;