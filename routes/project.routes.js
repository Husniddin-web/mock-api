const { getAllProjects, getProjectById, createProject, updateProject, deleteProject, getUserProject } = require("../controllers/project.controller")
const auth_middleware = require("../middleware/auth_middleware")
const { isAdmin } = require("../middleware/isAdmin")

const router = require("express").Router()


router.get("/", auth_middleware , isAdmin,getAllProjects)

router.get("/:id", auth_middleware, getProjectById)

router.get("/user/:user_id" ,getUserProject)

router.post("/",auth_middleware, createProject)

router.put("/:id",auth_middleware ,updateProject)


router.delete("/:id",auth_middleware, deleteProject)



module.exports = router