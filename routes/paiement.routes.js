const controller = require("../controllers/paiement.controller");
var bodyParser = require('body-parser');

module.exports = function(app) {
    app.post("/api/paiement/validerPaiement", controller.validerPaiement);
    app.post("/api/paiement/accepterPaiement", controller.accepterPaiement);
    app.get("/api/paiement/getAllPaiementValider", controller.getAllPaiementValider);
}