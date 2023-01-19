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
      totalAvancement: req.body.totalAvancement,
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
    Vehicule.find({ utilisateur: req.params.utilisateurId },
      (err, Vehicule) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        res.send(Vehicule);
      }
    )
  }