const config = require("../config/auth.config");
const db = require("../models");
const Vehicule = db.vehicule;
const utilisateur = db.utilisateur;

exports.createVehicule = (req, res) => {//insertion un vehicule d'un utilisateur  
 
  utilisateur.findOne({ _id: req.body.utilisateurId }, (err, utilisateur) => { //manao if hoe ra le utilisateur taflogy ao anaty liste utilisateur 
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
    if (!utilisateur) {
      res.status(404).send({ message: "Utilisateur not found" });
      return;
    }

    const car = new Vehicule({
      nom: req.body.nom,
      type: req.body.type,
      image: req.body.image,
      immatriculation: req.body.immatriculation,
      dateDebut: req.body.dateDebut,
      DateHeureFin: req.body.DateHeureFin,
      totalTempsReparation: req.body.totalTempsReparation,
      totalPrixReparation: req.body.totalPrixReparation,
      status: req.body.status,
      utilisateur: utilisateur._id///ty le id anle utilisateur le taflogy
    });

    car.save((err, vehicule) => {///miinsert eto
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      res.send({ message: "Vehicule was created successfully", vehicule });
    });
  });
};

exports.findVoitureClient = (req, res) => { ///maka voiture rehetra client izay niinserena
    console.log(req.params)
    Vehicule.find({status: "non valider", utilisateur: req.params.utilisateurId },
      (err, Vehicule) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        res.send(Vehicule);
      }
    )
  }

exports.findVoitureValide = (req, res) => { ///maka voiture rehetra client izay status valide
    console.log(req.params)
    Vehicule.find({ status: 'valide' , utilisateur: req.params.utilisateurId },
      (err, Vehicule) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        res.send(Vehicule);
      }
    )
  }
exports.findVehiculeReparationPayer = (req,res)=>{//listes voitures rehetra izay valider paiement
  Vehicule.find({ status: 'valide' })
  .populate(["utilisateur"])
  .exec((err, Vehicule) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    console.log(req.params)
    res.send(Vehicule);
    }
  );
};
exports.findVoitureTerminee = (req, res) => { ///maka voiture rehetra client izay status valide
  console.log(req.params)
  Vehicule.find({ status: 'terminee' },
    (err, Vehicule) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.send(Vehicule);
    }
  ).populate("utilisateur")
}
exports.findVoitureBondeSortieValider = (req, res) => { ///maka voiture rehetra client izay status valide
  console.log(req.params)
  Vehicule.find({ status: 'sortie valider' },
    (err, Vehicule) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.send(Vehicule);
    }
  ).populate("utilisateur")
}
exports.updateStatusVehicule= (req,res)=>{
  Vehicule.find({ _id: req.params._id }, (err, vehicule) => {
    if (err) {
      return res.status(500).send({ message: err });
    }
    console.log( req.params._id)
    if (!vehicule) {
      return res.status(404).send({ message: "vehicule not found" });
    }
    Vehicule.updateOne({ _id: req.params._id }, {$set :{ status:"sortie valider"}}, function(err, reparation) {
    if (err) {
      return res.status(500).send({ message: err });
    }
      return res.send({ message: "sortie valider" });
  });
});
};
exports.findVehiculeRecuperer = (req, res) => { ///maka voiture rehetra client izay status sortie valider
  console.log(req.params)
  Vehicule.find({ status: 'sortie valider',utilisateur: req.params.utilisateurId},
    (err, Vehicule) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.send(Vehicule);
    }
  ).populate("utilisateur")
}
exports.updateStatusVehiculeRecuperer= (req,res)=>{ //manova status anle vehicule sy miinsert historique
  Vehicule.find({ _id: req.params._id }, (err, vehicule) => {
    if (err) {
      return res.status(500).send({ message: err });
    }
    console.log( req.params._id)
    if (!vehicule) {
      return res.status(404).send({ message: "vehicule not found" });
    }
    
    Vehicule.updateOne({ _id: req.params._id }, {$set :{ status:"recuperer"}}, function(err, vehicule) {
    if (err) {
      return res.status(500).send({ message: err });
    }
      return res.send({ message: "recuperer" });
  });
});
};