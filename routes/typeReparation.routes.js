const controller = require("../controllers/typeReparation.controller");
var bodyParser = require('body-parser');

module.exports = function(app) {
    app.get("/api/typeReparation/findTypeReparation", controller.findTypeReparation);
    app.post("/api/typeReparation/createReparation", controller.createTypeReparation);
}