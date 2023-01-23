const config = require("../config/auth.config");
const db = require("../models");
const Reparation = db.reparation;
const vehicule = db.vehicule;
const typeReparation = db.typeReparation;

exports.createReparation = (req, res) => {
  //maka id anle vehicule kalo ra efa miexsiste ao 
  vehicule.findOne({ _id: req.body.vehicule }, (err, vehicule) => {
   
    if (err) {
      return res.status(500).send({ message: err });
    }

    if (!vehicule) {
      return res.status(404).send({ message: "Vehicule not found" });
    }
// dia efveo maka id anle typeReparation
    typeReparation.findOne({ _id: req.body.typeReparation }, (err, typeReparation) => {
      if (err) {
        return res.status(500).send({ message: err });
      }

      if (!typeReparation) {
        return res.status(404).send({ message: "Type of Reparation not found" });
      }
//dia miinsert amzay efveo 
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
exports.findDepotReparationParVoiture = (req, res) => { ///maka reparation par utilisateur et par voiture
  console.log(req.params)
  Reparation.find({ utilisateur: req.params.utilisateurId})
  .populate(["typeReparation","vehicule"])
  .exec((err, Reparation) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    console.log(req.params)
    res.send(Reparation);
    }
  );
};
exports.findReparationById = (req, res) => { ///maka reparation par utilisateur et par voiture
  console.log(req.params)
  Reparation.find({ _id: req.params._id})
  .populate(["typeReparation","vehicule"])
  .exec((err, Reparation) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    console.log(req.params)
    res.send(Reparation);
    }
  );
};
exports.deleteReparation = (req, res) => {//delete reparation
  Reparation.deleteOne({ _id: req.params._id })
  .then(() => {
  res.send({ message: "Reparation deleted successfully" });
  })
  .catch((err) => {
  res.status(500).send({ message: "Error deleting reparation" });
  });
};
exports.listeVehiculeDepot = (req, res) => {
  Reparation.find({ utilisateur: req.params.utilisateurId })
    .populate({
      path: "vehicule",
      select: "nom immatriculation type "
    })
    .exec((err, reparations) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      const distinctVehicles = reparations.map(r => r.vehicule)//mcreer table vaovao hanasivana le valiny
      .reduce((acc, curr) => {
        if (!acc.some(vehicle => vehicle._id.equals(curr._id))) {//le array some mverifier anle element actuel hoe efa miexiste ve ao amle tableau final ref tsy miexsiste de atsofoka sinon tsy atsofoka ra ef miexiste
          acc.push(curr);
        }
        return acc;
      }, []);
      res.send(distinctVehicles);
    });
};