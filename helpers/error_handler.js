
const errorHandler = (error, res) => {
    console.log(error)
    return res.status(400).send({ message: error.message })
}


module.exports = {
    errorHandler
}