const userJwt = require("../service/jwt_services")
const { to } = require("../helpers/to_promise")




module.exports = async function (req, res, next) {

    const authorization = req.headers.authorization

    if (!authorization) {
        return res.status(401).send({ message: "Unauthorization" , success :false })
    }

    const bearer = authorization.split(" ")[0]

    const token = authorization.split(" ")[1]


    if (bearer !== "Bearer" || !token) {
        return res.status(401).send({ message: "Unauthorization", success: false })
    }

    const [error, decodedToken] = await to(userJwt.verifyAccessToken(token))

    if (error) {
        return res.status(401).send({ message: error.message, success: true })
    }

    req.user = decodedToken
    console.log(decodedToken)
    next()

}