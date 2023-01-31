const controller = require("../controllers/reparation.controller");
var bodyParser = require('body-parser');

module.exports = function(app) {
    app.post("/api/reparation/createReparation", controller.createReparation);
    app.get("/api/reparation/findDepotReparationParVoiture/:vehicule", controller.findDepotReparationParVoiture);
    app.delete("/api/reparation/deleteReparation/:_id", controller.deleteReparation);
    app.get("/api/reparation/findReparationById/:_id", controller.findReparationById);
    app.get("/api/reparation/listeVehiculeDepot/:utilisateurId", controller.listeVehiculeDepot);
    app.get("/api/reparation/listeDepotVoitureParVoiture/:utilisateur/:vehicule", controller.listeDepotVoitureParVoiture);
    app.get("/api/reparation/getReparationParVehicule/:vehicule", controller.getReparationParVehicule);
    app.post("/api/reparation/updateOneReparationEncours/:_id", controller.updateOneReparationEncours);
    app.post("/api/reparation/updateOneReparationTerminee/:_id", controller.updateOneReparationTerminee);
    app.get("/api/reparation/getReparationAFaire/:vehicule", controller.getReparationAFaire);
    app.get("/api/reparation/getReparationEnCours/:vehicule", controller.getReparationEnCours);
    app.get("/api/reparation/getReparationTerminee/:vehicule", controller.getReparationTerminee);
    app.get("/api/reparation/getReparationavancement/:utilisateur/:vehicule", controller.getReparationavancement);
    app.post("/api/reparation/updateVehiculeTerminee/:vehicule", controller.updateVehiculeTerminee);
    app.get("/api/reparation/getFactureReparationParVoiture/:utilisateur/:vehicule", controller.getFactureReparationParVoiture);
    app.get("/api/reparation/getBondeSortieParVoiture/:utilisateur/:vehicule", controller.getBondeSortieParVoiture);
    app.get("/api/reparation/getHistoriqueReparation/:utilisateur/:vehicule", controller.getHistoriqueReparation);   
}