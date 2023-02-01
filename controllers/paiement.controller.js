const config = require("../config/auth.config");
const db = require("../models");
const Paiement = db.paiement;
const Vehicule = db.vehicule;
const path = require("path");
const fs = require("fs");
const finished = require('stream').finished;
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config;
// const multer = require('multer');
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'upload/pdf/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   }
// });
// const upload = multer({ storage: storage });


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
  .exec((err, paiements) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    const paiementsAttente = paiements.filter(paiement => paiement.vehicule !== null);
    res.send(paiementsAttente);
    }
  );
};
exports.accepterPaiement = (req, res) => { // ty no action ataon'ny responsable financier ivalidena anle paiement ao am pageny
  Vehicule.updateOne({ _id: req.body.vehicule }, {$set : {status: "valide"}}, (err, vehicule) => {
    if (err) {
      return res.status(500).send({ message: err });
    }
    if (!vehicule) {
      return res.status(404).send({ message: "Vehicule not found" });
    }
        return res.send({ message: "Paiement Valider avec succes" });
      });
};
exports.getAllPaiementValider = (req,res)=>{//par status "en attente"
  Paiement.find({})
      .populate({
          path: 'vehicule',
          populate: {path: "utilisateur"},
          match: { status: 'valide' }
      })
      .exec((err, paiements) => {
          if (err) {
              return res.status(500).send({ message: err });
          }
          // Only return the Paiement documents that have a 'valider' status vehicule
          const paiementsValider = paiements.filter(paiement => paiement.vehicule !== null);
          res.send(paiementsValider);
      });
};

// exports.sender = async (req, res) => {
//   try {
//     const { to, subject, text } = req.body;
//     console.log(req.files);
//     var transporter = nodemailer.createTransport({
//       port:587,
//       host:"smtp-mail.outlook.com",
//       auth: {
//         user: "senderPharmabot@outlook.fr",
//         pass: "ravaka123456789"
//       },
//       tls: {
//         rejectUnauthorized: false
//       }
//     });
//     var mailOptions = {
//         from: "senderPharmabot@outlook.fr",
//         to: to, 
//         subject: subject,
//         text: text,
//         attachments: req.files.map(file => {
//             return {
//                 filename: file.originalname,
//                 path: file.path
//             }
//         })
//     };
  //   await  transporter.sendMail(mailOptions, function(error,info){
  //     if (error) {
  //       console.log(error);
  //       res.status(500).send({ error });
  //     } else {
  //     console.log('Email sent: ' + info.response);
  //     res.status(200).send({ message: 'Email sent: ' + info.response });
  //     }
  //     });
  // } catch (err) {
  // console.log(err);
  // res.status(500).send({ err });
  // }
// }