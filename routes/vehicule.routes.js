const controller = require("../controllers/vehicule.controller");
var bodyParser = require('body-parser');

module.exports = function(app) {
    app.post("/api/vehicule/createVehicule", controller.createVehicule);
    app.get("/api/vehicule/findVoitureClient/:utilisateurId", controller.findVoitureClient);
    app.get("/api/vehicule/findVoitureValide/:utilisateurId", controller.findVoitureValide);
}