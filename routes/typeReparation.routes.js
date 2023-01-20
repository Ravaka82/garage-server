const controller = require("../controllers/typeReparation.controller");
var bodyParser = require('body-parser');

module.exports = function(app) {
    app.get("/api/typeReparation/findTypeReparation", controller.findTypeReparation);
    app.post("/api/typeReparation/createTypeReparation", controller.createTypeReparation);
    app.get("/api/typeReparation/findTypeReparationById/:_id",controller.findTypeReparationById);
}