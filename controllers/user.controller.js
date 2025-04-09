const { errorHandler } = require("../helpers/error_handler");
const { userValidation, updateValidation } = require("../validation/user.validation");
const User = require("../schema/user");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const uuid = require("uuid")
const mailService = require("../service/mail.service");
const userJwt = require("../service/jwt_services")
const { to } = require("../helpers/to_promise")
const config = require("config")

const registerUser = async (req, res) => {
    try {
        const { error, value } = userValidation(req.body);
        if (error) {
            return errorHandler(error, res);
        }

        const user = await User.findOne({ email: value.email });

        if (user) {
            return res.status(400).send({ message: "User already exists" });
        }

        const hashedPassword = bcrypt.hashSync(value.password, 10);

        const activation_link = uuid.v4()



        await mailService.sendMailActivationCode(value.email, `${config.get("api_url")}/api/user/activate/${activation_link}`)


        const newUser = await User.create({ ...value, password: hashedPassword, activation_link });

        res.status(201).send({ message: "User created successfully Send email activate link ", success: true, newUser });

    } catch (error) {
        errorHandler(error, res);
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate("projects").select("-password");
        res.status(200).send({ message: "Users retrieved successfully", success: true, users });
    } catch (error) {
        errorHandler(error, res);
    }
};




const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body

        const oldUser = await User.findOne({ email })

        if (!oldUser) {
            return res.status(401).send({ message: "email yoki parol notogri" })
        }

        const validPassword = bcrypt.compareSync(password, oldUser.password)

        if (!validPassword) {
            return res.status(400).send({ message: "email yoki parol notogri" })
        }

        if (!oldUser.is_active) {
            return res.status(400).send({ message: "User is not active send email actvation link", success: false })
        }

        const tokens = userJwt.generateToken({
            _id: oldUser._id,
            email: oldUser.email,
            name: oldUser.name,
            is_active: oldUser.is_active
        })

        oldUser.refresh_token = tokens.refreshToken

        await oldUser.save()

        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            maxAge: config.get("refresh_token_ms")
        })

        res.status(200).send({ message: "Hush kelibsiz", accessToken: tokens.accessToken, success: true })

    } catch (error) {

        errorHandler(error, res)

    }

}



const logOutUser = async (req, res) => {
    try {

        const { refreshToken } = req.cookies

        if (!refreshToken) {
            return res.status(401).send({ message: "Cookie token topilmadi" })
        }

        const user = await User.findOneAndUpdate({ refresh_token: refreshToken }, { refresh_token: "" }, { new: true })

        if (!user) {

            return res.status(401).send({ message: "Bunday tokenli user yoq" });

        }

        res.clearCookie("refreshToken")

        res.status(200).send({ message: "Log out" })

    } catch (error) {
        errorHandler(error, res)
    }
}




const refreshUserToken = async (req, res) => {

    try {
        console.log("1")
        const { refreshToken } = req.cookies

        if (!refreshToken) {

            return res.status(401).send({ message: "in cookie  token is not find" })

        }

        const [error, tokenFromCookie] = await to(userJwt.verifyRefreshToken(refreshToken))

        if (error) {

            return res.status(401).send({ error: "User" })

        }

        const user = await User.findOne({ refresh_token: refreshToken })

        if (!user) {
            return res.status(404).send({ message: "User not found " })
        }

        const tokens = userJwt.generateToken({
            _id: user._id,
            email: user.email,
            name: user.name,
            is_active: user.is_active
        })

        user.refresh_token = tokens.refreshToken

        await user.save()

        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            maxAge: config.get("refresh_token_ms")
        })

        res.status(200).send({ message: "Succes refresh token", success : true })


    } catch (error) {
        errorHandler(error, res)
    }
}












const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid User ID", success: false });
        }

        const user = await User.findById(id).select("-password");

        if (!user) {
            return res.status(404).send({ message: "User not found", success: false });
        }

        res.status(200).send({ message: "User retrieved successfully", success: true, user });
    } catch (error) {
        errorHandler(error, res);
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid User ID", success: false });
        }

        const { error, value } = updateValidation(req.body);

        if (error) {
            return errorHandler(error, res);
        }

        const user = await User.findByIdAndUpdate(id, value, {
            new: true,
            runValidators: true,
        }).select("-password"); // Exclude password field

        if (!user) {
            return res.status(404).send({ message: "User not found", success: false });
        }

        res.status(200).send({ message: "User updated successfully", success: true, user });
    } catch (error) {
        errorHandler(error, res);
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid User ID", success: false });
        }

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).send({ message: "User not found", success: false });
        }

        res.status(200).send({ message: "User deleted successfully", success: true });
    } catch (error) {
        errorHandler(error, res);
    }
};






const activateUser = async (req, res) => {
    try {
        const { link } = req.params
        const user = await User.findOne({ activation_link: link })

        if (!user) {
            return res.status(404).send({ message: "Not found"  ,success : false })
        }

        if (user.is_active) {
            return res.status(404).send({ message: "User is already active" , success : true })
        }
        user.is_active = true

        await user.save()

        res.status(200).send({ message: "User faollashtirldi", is_active: user.is_active })

    } catch (error) {
        errorHandler(error, res)
    }
}

module.exports = { activateUser,registerUser, getAllUsers, getUserById, updateUser, deleteUser, loginUser, logOutUser, refreshUserToken };
