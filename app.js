const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const fileUpload = require('express-fileupload');
const app = express();
app.use(cors());
var corsOptions = {
  origin: "https://garage-front-ravaka82.vercel.app/" // Cors ho an'ny côté front
};

app.use(cors(corsOptions));
app.use(
  fileUpload({
    useTempFiles: true
  })
);
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "garage-session",
    secret: "$2y$10$tKovGS01FuBG7g./52jWwudJz/Guj5TCuu7BkD1Mgvh6QUJt/Uf86", // bcrypt ngenereko (Raha vakiana dia garage)
    httpOnly: true
  })
);

const db = require("./models");
const dbConfig = require("./config/db.config");
const Role = db.role;


// Ao am db.config.js no manova anle url de connexion
db.mongoose
  .connect(dbConfig.MongooseURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connecter avec succès");
    initial();
  })
  .catch(err => {
    console.error("Erreur de connexion", err);
    process.exit();
  });

function initial() { // Initialisation role any am base de donnee
    Role.estimatedDocumentCount((err, count) => {
      if (!err && count === 0) {
        new Role({
          nom: "client"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("ajout 'client' au collection roles");
        });
  
        new Role({
          nom: "responsable_atelier"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("ajout 'responsable_atelier' au collection roles ");
        });
  
        new Role({
          nom: "responsable_financier"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("ajout 'responsable_financier' au collection roles ");
        });
      }
    });
  }
  var allowCrossDomain = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control");

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};
app.use(allowCrossDomain);
app.disable('etag');
//route de base
app.get("/", (req, res) => {
  res.json({ message: "Bienvenue API" });
});

//Route API

require('./routes/utilisateur.routes')(app);
require('./routes/role.routes')(app);
require('./routes/vehicule.routes')(app);
require('./routes/typeReparation.routes')(app);
require('./routes/reparation.routes')(app);
require('./routes/paiement.routes')(app);
require('./routes/auth.routes')(app);
// Demarrage serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Vous etes connectee au port ${PORT}.`);
});
module.exports = app