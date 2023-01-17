const mongoose = require("mongoose");
const TypeRepartition = mongoose.model(
    "TypeRepartition",
    new mongoose.Schema({
        nomTypeReparation:{type: String},
        description: {type: String},
        image: { type: String},
        prixReparation: { type: Number },
    })
  );
  
  module.exports = TypeRepartition;