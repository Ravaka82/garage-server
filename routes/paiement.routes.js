const controller = require("../controllers/paiement.controller");
var bodyParser = require('body-parser');
// const multer = require("multer");
// var upload = multer({ dest: 'uploads/' });

module.exports = function(app) {
    app.post("/api/paiement/validerPaiement", controller.validerPaiement);
    app.get("/api/paiement/findVehiculeEnAttente", controller.findVehiculeEnAttente);
    app.post("/api/paiement/accepterPaiement", controller.accepterPaiement);
    app.get("/api/paiement/getAllPaiementValider", controller.getAllPaiementValider);
    // app.post("/api/paiement/sender", upload.array('file',5), controller.sender);
}