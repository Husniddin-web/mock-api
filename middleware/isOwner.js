const { errorHandler } = require("../helpers/error_handler")

const isOwner = async (req, res, next) => {
    try {
        const userId = req.user._id
        const id = req.params.id

        if (id !== userId) {
            return res.status(403).send({ message: "You cant change other info", success: false })
        }

        next()
    } catch (error) {
        errorHandler(error, res)
    }
}


module.exports = { isOwner }