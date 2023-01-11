const { verificationInscription } = require("../middlewares");
const controller = require("../controllers/auth.controller");
var bodyParser = require('body-parser');

module.exports = function(app) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  // Creation compte
  app.post(
    "/api/auth/signup",
    [
    verificationInscription.checkDuplicateNomOuEmail,
    verificationInscription.checkRolesExisted
    ],
    controller.signup
  );

  // Connexion
  app.post("/api/auth/signin", controller.signin);

  // Deconnexion
  app.post("/api/auth/signout", controller.signout);
};