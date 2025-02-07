const router = require("express").Router()


const userRouter = require("./user.routes");

const projectRouter = require("./project.routes");


const schemaRouter = require("./schema.routes");

const mockRouter = require("./mock_api.routes");




router.use("/user", userRouter)


router.use("/project", projectRouter)

router.use("/schema", schemaRouter)

router.use("/mock", mockRouter)


module.exports = router