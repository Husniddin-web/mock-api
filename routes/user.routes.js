const { registerUser, getAllUsers, getUserById, updateUser, deleteUser, loginUser, refreshUserToken, logOutUser, activateUser } = require("../controllers/user.controller")
const auth_middleware = require("../middleware/auth_middleware")
const { isAdmin } = require("../middleware/isAdmin")
const { isOwner } = require("../middleware/isOwner")

const router = require("express").Router()

router.post("/", registerUser)

router.get("/", auth_middleware, isAdmin, getAllUsers)

router.get("/:id", auth_middleware, getUserById)

router.put("/:id", auth_middleware,isOwner, updateUser)

router.delete("/:id", auth_middleware, isAdmin, deleteUser)

router.post("/login", loginUser)

router.post("/logout", logOutUser)

router.post("/refresh", refreshUserToken)

router.get("/activate/:link", activateUser)





module.exports = router