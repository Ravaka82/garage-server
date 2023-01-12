const config = require("../config/auth.config");
const db = require("../models");
const Role = db.role;
exports.findRole = (req, res) => { 
    console.log(req.body)
    Role.find(
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        res.send(roles);
      }
    )
  }