const { errorHandler } = require("../helpers/error_handler");
const Model = require("../schema/schema");
const config = require("config");
const MAX_SCHEMA = config.get("max_schema");
const uuid = require("uuid")
const { faker } = require("@faker-js/faker")

const getAllSchemas = async (req, res) => {
    try {
        const schemas = await Model.find();
        res.status(200).send({ success: true, data: schemas });
    } catch (error) {
        errorHandler(error, res);
    }
};


const getSchemaByProjectId = async (req, res) => {
    try {
        const { project_id } = req.params;
        console.log(project_id);
        const schemas = await Model.find({ project_id });


        res.status(200).send({ success: true, data: schemas });
    } catch (error) {
        errorHandler(error, res);
    }
};


const updateSchema = async (req, res) => {
    try {
        const { id } = req.params;
        const { schema_name, fields, count } = req.body;

        const schema = await Model.findById(id);
        if (!schema) {
            return res.status(404).send({ success: false, message: "Schema not found" });
        }
        console.log(fields)

        const generatedData = [];
        if (count) {
            for (let i = 0; i < count; i++) {
                let fieldData = {};
                fieldData["id"] = uuid.v4()

                for (const [key, value] of Object.entries(fields)) {
                    try {
                        const fakerFunction = value.split(".").reduce((acc, curr) => acc[curr], faker);
                        fieldData[key] = fakerFunction();
                    } catch (err) {
                        fieldData[key] = null;
                        console.error(`Invalid faker method: ${value}`);
                    }
                }
                generatedData.push(fieldData);
            }
        }

        schema.data = generatedData;
        if (schema_name) {
            schema.schema_name = schema_name
        }
        await schema.save();

        res.status(200).send({ success: true, message: "Schema updated successfully", data: schema });
    } catch (error) {
        errorHandler(error, res);
    }
};

const deleteSchema = async (req, res) => {
    try {
        const { id } = req.params;
        const schema = await Model.findByIdAndDelete(id);
        if (!schema) {
            return res.status(404).send({ success: false, message: "Schema not found" });
        }
        res.status(200).send({ success: true, message: "Schema deleted successfully" });
    } catch (error) {
        errorHandler(error, res);
    }
};



const createSchema = async (req, res) => {

    try {
        const { schema_name, project_id, fields, count } = req.body;
        const existingSchema = await Model.findOne({ project_id, schema_name });
        if (existingSchema) {
            return res
                .status(400)
                .send({ message: "Schema name already exists for this project", success: false });
        }

        const schemas = await Model.find({ project_id });
        if (schemas.length >= MAX_SCHEMA) {
            return res
                .status(400)
                .send({ message: "You need premium", success: false });
        }

        const generatedData = [];
        for (let i = 0; i < count; i++) {
            let fieldData = {};
            fieldData["id"] = uuid.v4()
            for (const [key, value] of Object.entries(fields)) {
                try {
                    const fakerFunction = value.split(".").reduce((acc, curr) => acc[curr], faker);
                    fieldData[key] = fakerFunction();
                } catch (err) {
                    fieldData[key] = null;
                    console.error(`Invalid faker method: ${value}`);
                }
            }

            generatedData.push(fieldData);
        }

        const newSchema = new Model({
            project_id,
            schema_name,
            data: generatedData,
        });

        await newSchema.save();

        res.status(201).send({ message: "Schema created successfully", success: true, newSchema });
    } catch (error) {
        errorHandler(error, res);
    }
};

module.exports = {
    createSchema,
    getAllSchemas,
    getSchemaByProjectId,
    updateSchema,
    deleteSchema,
};
