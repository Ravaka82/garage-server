 exports.clientBoard = (req, res) => {
    res.status(200).send("Contenu client");
  };
  
  exports.responsableAtelierBoard = (req, res) => {
    res.status(200).send("Contenu responsable atelier");
  };
  
  exports.responsableFinancierBoard = (req, res) => {
    res.status(200).send("Contenu responsable financier");
  };
  