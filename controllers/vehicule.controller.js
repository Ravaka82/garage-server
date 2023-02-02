const config = require("../config/auth.config");
const db = require("../models");
const Vehicule = db.vehicule;
const utilisateur = db.utilisateur;
const streamifier = require('streamifier');
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: 'doqw2jsg3',
  api_key: '472566731662461',
  api_secret: 'nGIW9NMQwDsXwQDI42nQ9aNjekk',
  secure:true
});
let streamUpload = (file) => {
  return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream(
          (error, result) => {
              if (result) {
                  resolve(result);
              } else {
                  reject(error);
              }
          }
      );
      streamifier.createReadStream(file.buffer).pipe(stream);
  });
};
  exports.createVehicule = async(req, res) => {
    try {
      const file = req.file
      let result = await streamUpload(file);
      const utilisateurId = req.body.utilisateurId;
      utilisateur.findOne({ _id: utilisateurId }, (err, utilisateur) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        if (!utilisateur) {
          res.status(404).send({ message: "Utilisateur not found" });
          return;
        }
        const vehicule = new Vehicule({
          nom: req.body.nom,
          type: req.body.type,
          image: result.url,
          immatriculation: req.body.immatriculation,
          utilisateur: utilisateurId
        });
        vehicule.save((err, vehicule) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          res.send({ message: "Vehicule was saved successfully!" });
        });
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
    // if (!image) {
    //   res.status(400).send({ message: "No image provided" });
    //   return;
    // }
    // cloudinary.uploader.upload(image.path, (error, result) => {
    // if (error) {
    //   res.status(400).send({ message: error.message });
    //   return;
    // }
    // try {
    
    //   } catch (error) {
    //     res.status(500).send({ message: error.message });
    //   }
    // });
  };

/*upload multer ty 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/');
  },
  filename: function (req, file, cb) {
    let ext = file.mimetype.split('/')[1];
    let filename = `image-${Date.now()}.${ext}`;
    cb(null, filename);
  }
});
exports.createVehicule = (req, res) => {
  let upload = multer({ storage }).array("image", 1);
  upload(req, res, function (error) {
    if (error) {
      res.status(400).send({ message: error.message });
      return;
    }
    try {
      const utilisateurId = req.body.utilisateurId;
      console.log("utilisateur"+utilisateurId )
      utilisateur.findOne({ _id: utilisateurId }, (err, utilisateur) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        if (!utilisateur) {
          res.status(404).send({ message: "Utilisateur not found" });
          return;
        }
        const vehicule = new Vehicule({
          nom: req.body.nom,
          type: req.body.type,
          image: req.files[0].filename,
          immatriculation: req.body.immatriculation,
          utilisateur: utilisateurId,
        });
        console.log(vehicule)
        vehicule.save((err, vehicule) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          res.send({ message: "Vehicule was saved successfully!" });
        });
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });
};
*/
exports.findVoitureClient = (req, res) => { ///maka voiture rehetra client izay niinserena
    console.log(req.params)
    Vehicule.find({status: "non valider", utilisateur: req.params.utilisateurId },
      (err, Vehicule) => {
        console.log(Vehicule)
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
exports.updateStatusVehiculeRecuperer= (req,res)=>{ //manova status anle vehicule 
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
exports.findHistoriqueVehicule = (req, res) => { ///maka voiture rehetra client izay status recuperer
  console.log(req.params)
  Vehicule.find({ status: 'recuperer',utilisateur: req.params.utilisateurId},
    (err, Vehicule) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.send(Vehicule);
    }
  ).populate("utilisateur")
}
exports.stats = async (req, res) => {
  try {
    const list = await Vehicule.find({ status: "terminee" ,status: "recuperer"});
    const data = [];
    list.forEach(car => {
      const vehicleName = car.nom;
      const timeArr = car.totalTempsReparation.split(",");
      console.log(timeArr)
      const days = timeArr[0] ? parseInt(timeArr[0].replace("j", "")) : 0;
      const hours = timeArr[1] ? parseInt(timeArr[1].replace("h", "")) : 0;
      const minutes = timeArr[2] ? parseInt(timeArr[2].replace("mn", "")) : 0;
      const seconds = timeArr[3] ? parseInt(timeArr[3].replace("s", "")) : 0;
      console.log(seconds)
      const totalTime = days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds;
      console.log(totalTime)
      const avgTimeInDays = totalTime / (24 * 60 * 60);
      const avgTimeInHours = totalTime / (60 * 60);//s 
      const avgTimeInMinutes = totalTime / 60;
      const avgTimeInSeconds = totalTime;
      data.push({
        avgTimeInDays,
        avgTimeInHours,
        avgTimeInMinutes,
        avgTimeInSeconds,
        vehicleName
      });
    });
    res.send(data);
  } catch (err) {
    res.status(500).send({ message: err });
  }
};