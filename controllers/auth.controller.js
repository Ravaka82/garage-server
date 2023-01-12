const config = require("../config/auth.config");
const db = require("../models");
const Utilisateur = db.utilisateur;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => { // Creation utilisateur
  console.log(req.body)
  const user = new Utilisateur({
    nom: req.body.nom,
    email: req.body.email,
    mot_de_passe: bcrypt.hashSync(req.body.mot_de_passe, 8),
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          nom: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "Utilisateur was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ nom: "client" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "Utilisateur was registered successfully!" });
        });
      });
    }
  });
};

exports.signin = (req, res) => { // Connexion utilisateur
  Utilisateur.findOne({
    nom: req.body.nom,
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "Utilisateur Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.mot_de_passe,
        user.mot_de_passe
      );

      if (!passwordIsValid) {
        return res.status(401).send({ message: "Invalid Password!" });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, //Le token expire dans 24 heures
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].nom.toUpperCase());
      }

      req.session.token = token;

      res.status(200).send({
        id: user._id,
        nom: user.nom,
        email: user.email,
        roles: authorities,
        token: token
      });
    });
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "Vous vous êtes déconnecter!" });
  } catch (err) {
    this.next(err);
  }
};
