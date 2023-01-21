const controller = require("../controllers/reparation.controller");
var bodyParser = require('body-parser');

module.exports = function(app) {
    app.post("/api/reparation/createReparation", controller.createReparation);
    app.get("/api/reparation/findDepotReparationParVoiture/:utilisateurId", controller.findDepotReparationParVoiture);
}