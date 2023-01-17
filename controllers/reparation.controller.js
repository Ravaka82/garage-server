const config = require("../config/auth.config");
const db = require("../models");
const Reparation = db.reparation;
const vehicule = db.vehicule;
const typeReparation = db.typeReparation;

exports.createReparation = (req, res) => {
  vehicule.findOne({ _id: req.body.vehiculeId }, (err, vehicule) => {
    console.log(req.body.vehiculeId)
    if (err) {
      return res.status(500).send({ message: err });
    }

    if (!vehicule) {
      return res.status(404).send({ message: "Vehicule not found" });
    }

    typeReparation.findOne({ _id: req.body.typeReparationId }, (err, typeReparation) => {
      if (err) {
        return res.status(500).send({ message: err });
      }

      if (!typeReparation) {
        return res.status(404).send({ message: "Type of Reparation not found" });
      }

      const newReparation = new Reparation({
        avancement: req.body.avancement,
        statusUneReparation : req.body.statusUneReparation,
        vehicule: vehicule._id,
        typeReparation: typeReparation._id,
      });

      newReparation.save((err) => {
        if (err) {
          return res.status(500).send({ message: err });
        }

        res.send({ message: "Reparation created successfully" });
      });
    });
  });
};