const controller = require("../controllers/role.controller");
var bodyParser = require('body-parser');

module.exports = function(app) {
    app.get("/api/role/findRole", controller.findRole);
}