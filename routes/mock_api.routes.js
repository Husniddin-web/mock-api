const express = require("express");

const { updateDataById, getDataById, deleteDataById, addData } = require("../controllers/mock_api.controller");

const { getAllData } = require("../controllers/mock_api.controller");

const router = express.Router();

router.get("/:project_link/:schema_name", getAllData);
router.put("/:project_link/:schema_name/:dataId", updateDataById);
router.get("/:project_link/:schema_name/:dataId", getDataById);
router.delete("/:project_link/:schema_name/:dataId", deleteDataById);
router.post("/:project_link/:schema_name", addData);

module.exports = router;
