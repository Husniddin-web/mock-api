const Project = require("../schema/project")
const Model = require("../schema/schema")
const uuid = require("uuid")
const { errorHandler } = require("../helpers/error_handler")


const updateDataById = async (req, res) => {
    try {
        const value = req.body;
        console.log(value)
        const { project_link, schema_name, dataId } = req.params;
        console.log(project_link, schema_name, dataId)

        const project = await Project.findOne({ project_link });
        if (!project) {
            return res.status(400).send({ message: "You don't have this project", success: false });
        }

        const schema = await Model.findOne({ project_id: project._id, schema_name });
        if (!schema) {
            return res.status(400).send({ message: "Schema not found in this project", success: false });
        }

        const dataIndex = schema.data.findIndex((item) => item.id === dataId);
        if (dataIndex === -1) {
            return res.status(404).send({ message: "Data entry not found", success: false });
        }

        schema.data[dataIndex] = { ...schema.data[dataIndex], ...value };
        console.log(schema.data[dataIndex])
        await schema.save();

        res.status(200).send({ message: "Data updated successfully", success: true, data: schema.data[dataIndex] });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", success: false, error: error.message });
    }
};


const getDataById = async (req, res) => {
    try {
        const { project_link, schema_name, dataId } = req.params;

        const project = await Project.findOne({ project_link });
        if (!project) {
            return res.status(400).send({ message: "You don't have this project", success: false });
        }

        const schema = await Model.findOne({ project_id: project._id, schema_name });
        if (!schema) {
            return res.status(400).send({ message: "Schema not found in this project", success: false });
        }

        const data = schema.data.find((item) => item.id === dataId);
        if (!data) {
            return res.status(404).send({ message: "Data entry not found", success: false });
        }

        res.status(200).send({ message: "Data retrieved successfully", success: true, data });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", success: false, error: error.message });
    }
};


const addData = async (req, res) => {
    try {
        const value = req.body;
        const { project_link, schema_name } = req.params;

        const project = await Project.findOne({ project_link });
        if (!project) {
            return res.status(400).send({ message: "You don't have this project", success: false });
        }

        const schema = await Model.findOne({ project_id: project._id, schema_name });
        if (!schema) {
            return res.status(400).send({ message: "Schema not found in this project", success: false });
        }

        const newData = { id: uuid.v4(), ...value };
        schema.data.push(newData);
        await schema.save();

        res.status(201).send({ message: "Data added successfully", success: true, data: newData });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", success: false, error: error.message });
    }
};


const deleteDataById = async (req, res) => {
    try {
        const { project_link, schema_name, dataId } = req.params;

        const project = await Project.findOne({ project_link });
        if (!project) {
            return res.status(400).send({ message: "You don't have this project", success: false });
        }

        const schema = await Model.findOne({ project_id: project._id, schema_name });
        if (!schema) {
            return res.status(400).send({ message: "Schema not found in this project", success: false });
        }

        schema.data = schema.data.filter((item) => item.id !== dataId);
        await schema.save();

        res.status(200).send({ message: "Data deleted successfully", success: true });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", success: false, error: error.message });
    }
};



const getAllData = async (req, res) => {

    try {
        const { project_link, schema_name } = req.params;

        const project = await Project.findOne({ project_link });
        if (!project) {
            return res.status(400).send({ message: "You don't have this project", success: false });
        }

        const schema = await Model.findOne({ project_id: project._id, schema_name });
        if (!schema) {
            return res.status(400).send({ message: "Schema not found in this project", success: false });
        }


        res.status(200).send({ data: schema.data, success: true })

    } catch (error) {
        errorHandler(error, res)
    }
}




module.exports = { getAllData, deleteDataById, getDataById, addData, updateDataById }