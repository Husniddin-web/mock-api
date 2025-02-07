const Joi = require("joi");

const userValidation = (data) => {
    const userSchema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });
    return userSchema.validate(data, { abortEarly: false });
};

const updateValidation = (data) => {
    const updateSchema = Joi.object({
        name: Joi.string().optional()

    });
    return updateSchema.validate(data, { abortEarly: false });
};

module.exports = {
    userValidation,
    updateValidation,
};
