
const express = require("express");
const router = express.Router();

const ProdutoController =
    require("../controllers/ProdutoController");

router.get("/", ProdutoController.listar);

router.post("/", ProdutoController.cadastrar);

module.exports = router;
