const { createSchema, getAllSchemas, updateSchema, deleteSchema, getSchemaByProjectId } = require("../controllers/create_schema.controller")

const router = require("express").Router()
const authMiddleware = require("../middleware/auth_middleware")
const { isAdmin } = require("../middleware/isAdmin")

router.get("/", authMiddleware, isAdmin, getAllSchemas);

router.post("/", authMiddleware, createSchema)

router.get("/:project_id", authMiddleware, getSchemaByProjectId)

router.put("/:id", authMiddleware, updateSchema)

router.delete("/:id", authMiddleware, deleteSchema);




module.exports = router