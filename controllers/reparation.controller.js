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
        dateHeureDebut: req.body.dateHeureDebut,
        dateHeureFin: req.body.dateHeureFin,
        tempsReparation: req.body.statusUneReparation,
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
exports.findDepotReparationParVoiture = (req, res) => { ///maka reparation par utilisateur
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
exports.findReparationById = (req, res) => { ///maka reparation par id
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
exports.listeVehiculeDepot = (req, res) => {//liste vehicule reparer par utilisateur
  Reparation.find({ utilisateur: req.params.utilisateurId })
    .populate({
      path: "vehicule",
      match: { utilisateur: req.params.utilisateurId , status:"non valider"},
      select: "nom type image immatriculation"
    })
    .exec((err, reparations) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      const distinctVehicles = reparations
        .filter(r => r.vehicule)
        .map(r => r.vehicule)
        .reduce((acc, curr) => {
          if (!acc.some(vehicle => vehicle._id.equals(curr._id))) {
            acc.push(curr);
          }
          return acc;
        }, []);
      res.send(distinctVehicles);
    });
};
exports.listeDepotVoitureParVoiture = (req,res)=>{//par voiture
  Reparation.find({ utilisateur: req.params.utilisateurId , vehicule: req.params.vehicule })
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
exports.getReparationParVehicule= (req,res)=>{//les reparations par vehicule
  Reparation.find({ vehicule: req.params.vehicule })
  .populate("typeReparation")
  .populate({
    path: 'vehicule',
    populate: {path: "utilisateur"},
    match: { status: 'valide' }
})
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
exports.updateOneReparationEncours= (req,res)=>{
    Reparation.find({ _id: req.params._id }, (err, reparation) => {
      if (err) {
        return res.status(500).send({ message: err });
      }
      console.log( req.params._id)
      if (!reparation) {
        return res.status(404).send({ message: "reparation not found" });
      }
      if (reparation.statusUneReparation==="en cours") {
        return res.status(400).send({ message: "reparation is already'en cours'" });
      }
      Reparation.updateOne({ _id: req.params._id }, {$set : {dateHeureDebut:Date.now()}}, function(err, reparation) {
      if (err) {
        return res.status(500).send({ message: err });
      }
      Reparation.updateOne({ _id: req.params._id }, {$set : {statusUneReparation:"en cours"}}, (err, reparation) => {
      if (err) {
        return res.status(500).send({ message: err });
      }
        return res.send({ message: "status en cours" });
      });
    });
  });
};
exports.updateOneReparationTerminee=(req,res)=>{
  Reparation.find({ _id: req.params._id }, (err, reparation) => {
      if (err) {
        return res.status(500).send({ message: err });
      }
      console.log( req.params._id)
      if (!reparation) {
        return res.status(404).send({ message: "reparation not found" });
      }
      if (reparation.statusUneReparation==="terminee") {
        return res.status(400).send({ message: "reparation is already'terminee'" });
      }
      Reparation.updateOne({ _id: req.params._id }, {$set : {dateHeureFin:Date.now()}}, function(err, reparation) {
      if (err) {
        return res.status(500).send({ message: err });
      }
      Reparation.updateOne({ _id: req.params._id }, {$set : {statusUneReparation:"terminee"}}, (err, reparation) => {
      if (err) {
        return res.status(500).send({ message: err });
      }
        return res.send({ message: "status terminée" });
      });
    });
});
};
exports.getReparationAFaire= (req,res)=>{//les reparations par vehicule
  Reparation.find({ vehicule: req.params.vehicule,statusUneReparation: "à faire"})
  .populate("typeReparation")
  .populate({
    path: 'vehicule',
    populate: {path: "utilisateur"},
    match: { status: 'valide' }
})
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
exports.getReparationEnCours= (req,res)=>{//les reparations par vehicule
  Reparation.find({ vehicule: req.params.vehicule,statusUneReparation: "en cours"})
  .populate("typeReparation")
  .populate({
    path: 'vehicule',
    populate: {path: "utilisateur"},
    match: { status: 'valide' }
})
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
exports.getReparationTerminee= (req,res)=>{//les reparations par vehicule
  Reparation.find({ vehicule: req.params.vehicule,statusUneReparation: "terminee"})
  .populate("typeReparation")
  .populate({
    path: 'vehicule',
    populate: {path: "utilisateur"},
    match: { status: 'valide' }
})
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
exports.getReparationavancement= (req,res)=>{//les reparations avec les avancements
  Reparation.find({ utilisateur: req.params.utilisateurId,vehicule: req.params.vehicule })
  .populate("typeReparation")
  .populate({
    path: 'vehicule',
    populate: {path: "utilisateur"},
    match: { status: 'valide' }
})
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