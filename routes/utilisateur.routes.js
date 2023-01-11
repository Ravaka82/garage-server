const { authJwt } = require("../middlewares");
const controller = require("../controllers/utilisateur.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/client", [authJwt.verifyToken, authJwt.isClient], controller.clientBoard);

  app.get(
    "/api/test/atelier",
    [authJwt.verifyToken, authJwt.isResponsableAtelier],
    controller.responsableAtelierBoard
  );

  app.get(
    "/api/test/finance",
    [authJwt.verifyToken, authJwt.isResponsableFinancier],
    controller.responsableFinancierBoard
  );
};