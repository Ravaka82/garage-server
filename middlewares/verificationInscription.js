const db = require("../models");
const ROLES = db.ROLES;
const User = db.utilisateur;

checkDuplicateNomOuEmail = (req, res, next) => {
  // Nom
  User.findOne({
    nom: req.body.nom
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      res.status(400).send({ message: "Ce nom existe déjà" });
      return;
    }

    // Email
    User.findOne({
      email: req.body.email
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (user) {
        res.status(400).send({ message: "Cet email existe déjà" });
        return;
      }

      next();
    });
  });
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Le Role ${req.body.roles[i]} n'existe pas!`
        });
        return;
      }
    }
  }

  next();
};

const verificationInscription = {
  checkDuplicateNomOuEmail,
  checkRolesExisted
};

module.exports = verificationInscription;