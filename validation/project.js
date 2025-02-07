const Joi = require("joi");

const projectValidation = (data) => {
    const projectSchema = Joi.object({
        user_id: Joi.string().required(),
        project_name: Joi.string().min(3).max(100).required(),
        description: Joi.string().max(500),
    });

    return projectSchema.validate(data, { abortEarly: false });
};

module.exports = projectValidation;
