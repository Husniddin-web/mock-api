const config = require('config');

const jwt = require("jsonwebtoken");


class JwtService {

    constructor(accesKey, refreshKey, accessTime, refreshTime) {

        this.accesKey = accesKey

        this.refreshKey = refreshKey

        this.accessTime = accessTime

        this.refreshTime = refreshTime

    }

    generateToken(payload) {

        const accessToken = jwt.sign(payload, this.accesKey, { expiresIn: this.accessTime })

        const refreshToken = jwt.sign(payload, this.refreshKey, { expiresIn: this.refreshTime })

        return {

            accessToken,
            
            refreshToken
        }

    }

    async verifyAccessToken(token) {

        return jwt.verify(token, this.accesKey)

    }

    async verifyRefreshToken(token) {

        return jwt.verify(token, this.refreshKey)

    }

}




module.exports = new JwtService(
    config.get("access_key"),
    config.get("refresh_key"),
    config.get("access_time"),
    config.get("refresh_time")
)