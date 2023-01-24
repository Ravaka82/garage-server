const config = require("../config/auth.config");
const db = require("../models");
const Paiement = db.paiement;
const Vehicule = db.vehicule;

exports.validerPaiement = (req, res) => {
    Vehicule.findOne({ _id: req.body.vehicule }, (err, vehicule) => {
      if (err) {
        return res.status(500).send({ message: err });
      }
      if (!vehicule) {
        return res.status(404).send({ message: "Vehicule not found" });
      }
  

      if (vehicule.status === "en attente") {
        return res.status(400).send({ message: "Vehicule is already in 'en attente' status" });
      }
  
      const newPaiement = new Paiement({
        vehicule: vehicule._id,
      });
  
      newPaiement.save((err) => {
        if (err) {
          return res.status(500).send({ message: err });
        }
      });
  
      Vehicule.updateOne({ _id: req.body.vehicule }, {$set : {status: "en attente"}}, function(err, vehicule) {
        if (err) {
            return res.status(500).send({ message: err });
        }
    
        Vehicule.updateOne({ _id: req.body.vehicule }, {$set : {totalPrixReparation: req.body.prix}}, (err, vehicule) => {
          if (err) {
            return res.status(500).send({ message: err });
          }

          return res.send({ message: "Paiement and vehicule's status updated successfully" });
        });
      })
    })
  }
exports.findVehiculeEnAttente = (req,res)=>{//liste vehicule statuts en attente
  console.log(req.params)
  Paiement.find({ status:"en attente"})
  .populate({
      path: "vehicule",
      populate: {path: "utilisateur"},
      match: { status:"en attente"},
      select: "nom type image immatriculation status totalPrixReparation datePaiement utilisateur"
    })
  .exec((err, Paiement) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    console.log(req.params)
    res.send(Paiement);
    }
  );
};