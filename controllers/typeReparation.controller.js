const config = require("../config/auth.config");
const db = require("../models");
const TypeReparation = db.typeReparation;
exports.findTypeReparation = (req, res) => { ///maka typeReparation rehetra
    console.log(req.body)
    TypeReparation.find(
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        res.send(roles);
      }
    )
  }
  exports.createTypeReparation = (req, res) => {
    const typeRepare = new TypeReparation({
        nomTypeReparation:req.body.nomTypeReparation,
        description:req.body.description,
        image: req.body.image,
        prixReparation:req.body.prixReparation
      });
  
      typeRepare.save((err, typeReparation) => {///miinsert eto
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
  
        res.send({ message: "TypeReparation was created successfully", typeReparation });
      });
  }
  exports.findTypeReparationById = (req, res) => { ///maka typeReparation By id 
    console.log(req.params.nomTypeReparation)
    TypeReparation.find({_id:req.params._id},
      (err, TypeReparation) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        res.send(TypeReparation);
      }
    )
  }