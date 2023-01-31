const config = require("../config/auth.config");
const db = require("../models");
const Reparation = db.reparation;
const vehicule = db.vehicule;
const typeReparation = db.typeReparation;
const moment = require('moment-timezone');
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
      console.log("new"+newReparation);
        res.send({ message: "Reparation created successfully" });
      });
    });
  });
};
exports.findDepotReparationParVoiture = (req, res) => { ///maka reparation par utilisateur
  console.log(req.params)
  Reparation.find({ vehicule: req.params.vehicule})
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
      Reparation.updateOne({ _id: req.params._id }, {$set : {dateHeureDebut:new Date().toLocaleString("fr-FR", {timeZone: "Indian/Antananarivo"})}}, function(err, reparation) {
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
exports.updateOneReparationTerminee = (req, res) => {
    Reparation.findOne({ _id: req.params._id }, (err, reparation) => {
      if (err) {
        return res.status(500).send({ message: err });
      }
      if (!reparation) {
        return res.status(404).send({ message: "Reparation not found" });
      }
      if (reparation.statusUneReparation === "terminee") {
        return res.status(400).send({ message: "Reparation is already 'terminee'" });
      }
      const dateHeureFin = new Date().toLocaleString("fr-FR", {timeZone: "Indian/Antananarivo"});
      Reparation.updateOne({ _id: req.params._id }, { $set: { dateHeureFin } }, function (err) {
        if (err) {
          return res.status(500).send({ message: err });
        }
      });
      Reparation.findOne({ _id: req.params._id }, (err, updatedReparation) => {
        if (err) {
          return res.status(500).send({ message: err });
        }
        const dateHeureDebut = moment(updatedReparation.dateHeureDebut, "DD/MM/YYYY HH:mm:ss").toDate();
        const dateHeureFins = moment(dateHeureFin, "DD/MM/YYYY HH:mm:ss").toDate();
        
        const duration = dateHeureFins - dateHeureDebut;      
        
        console.log(dateHeureDebut)
        console.log(dateHeureFins)  
        console.log(duration)      
       
        const diffDays = Math.floor(duration / (1000 * 60 * 60 * 24)); 
        const diffhours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); 
        const diffminutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60)); 
        const diffseconds = Math.floor((duration % (1000 * 60)) / 1000); 
  
      // update tempsReparation
      Reparation.updateOne({ _id: req.params._id }, { $set: { tempsReparation:diffDays+"j,"+diffhours+"h,"+diffminutes+"mn,"+diffseconds+"s" } }, (err) => {
        if (err) {
          return res.status(500).send({ message: err });
        }
        Reparation.updateOne({ _id: req.params._id }, { $set: { statusUneReparation: "terminee" } }, (err) => {
          if (err) {
            return res.status(500).send({ message: err });
          }
          return res.send({ message: "status terminée" });
        });
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
const addRepairTime = (time1, time2) => {
  const time1Arr = time1.split(",");
  const time2Arr = time2.split(",");
  let days = parseInt(time1Arr[0].slice(0, -1)) + parseInt(time2Arr[0].slice(0, -1));
  let hours = parseInt(time1Arr[1].slice(0, -1)) + parseInt(time2Arr[1].slice(0, -1));
  let minutes = parseInt(time1Arr[2].slice(0, -2)) + parseInt(time2Arr[2].slice(0, -2));
  let seconds = parseInt(time1Arr[3]) + parseInt(time2Arr[3]);
  while (seconds >= 60) {
      seconds -= 60;
      minutes++;
  }
  while (minutes >= 60) {
      minutes -= 60;
      hours++;
  }
  while (hours >= 24) {
      hours -= 24;
      days++;
  }
  console.log(`${days}j,${hours}h,${minutes}mn,${seconds}s`)
  return `${days}j,${hours}h,${minutes}mn,${seconds}s`;
};
exports.updateVehiculeTerminee = (req, res) => {
    try {
        Reparation.find({vehicule: req.params.vehicule}, (err, repairList) => {
            if (err) {
                return res.status(500).send({ message: err });
            }
            console.log(req.params)
            let totalRepairTime = "0j,0h,0mn,0s";
            repairList.forEach(repair => {
                totalRepairTime = addRepairTime(totalRepairTime,repair.tempsReparation);
            });
            const dateHeureFin = new Date().toLocaleString("fr-FR", {timeZone: "Indian/Antananarivo"});
            vehicule.updateOne({ _id: req.params.vehicule }, { $set: { DateHeureFin: dateHeureFin } }, function (err) {
              if (err) {
                return res.status(500).send({ message: err });
              }
            });
            const Status = "terminee";
            vehicule.updateOne({ _id: req.params.vehicule }, { $set: { status: Status } }, function (err) {
              if (err) {
                return res.status(500).send({ message: err });
              }
            });
            console.log("totalTempsReparation:"+totalRepairTime)
            vehicule.updateOne({ _id: req.params.vehicule }, { $set: {  totalTempsReparation: totalRepairTime } }, (err) => {
              if (err) {
                return res.status(500).send({ message: err });
              }
              res.send({ message: "Vehicule updated successfully" });
            });
        });
    } catch (error) {
        res.status(500).send(error);
    }
  };
exports.getFactureReparationParVoiture= (req,res)=>{//mamoaka facture an ilay reparation client iray par voiture
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
exports.getBondeSortieParVoiture= (req,res)=>{
  Reparation.find({ utilisateur: req.params.utilisateurId,vehicule: req.params.vehicule })
  .populate("typeReparation")
  .populate({
    path: 'vehicule',
    populate: {path: "utilisateur"},
    match: { status: 'terminee' }
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
exports.getHistoriqueReparation= (req,res)=>{//les reparations par vehicule historiques
  Reparation.find({ utilisateur: req.params.utilisateurId,vehicule: req.params.vehicule,statusUneReparation: "terminee"})
  .populate("typeReparation")
  .populate({
    path: 'vehicule',
    populate: {path: "utilisateur"},
    match: { status: 'recuperer' }
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
