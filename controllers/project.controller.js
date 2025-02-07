const Project = require("../schema/project");
const projectValidation = require("../validation/project");
const { errorHandler } = require("../helpers/error_handler");
const User = require("../schema/user");


const createProject = async (req, res) => {

    try {

        const { error, value } = projectValidation(req.body);

        if (error) {
            return res.status(400).send({ message: "Validation error", error: error.details });
        }

        if (value.user_id) {

            const project = await Project.findOne({ user_id: value.user_id, project_name: value.project_name });

            if (project) {
                return res.status(400).send({ message: "This project name already exist", success: false })
            }

            const user = await User.findById(value.user_id);
            if (!user) {
                return res.status(404).send({ message: "User not found", success: false });
            }

            const maxProjects = 2;
            if (user.projects.length >= maxProjects) {
                return res
                    .status(400)
                    .send({ message: `User cannot have more than ${maxProjects} projects`, success: false });
            }
        }

        const newProject = await Project.create(value);

        if (value.user_id) {
            const user = await User.findById(value.user_id);
            if (user) {
                user.projects.push(newProject._id);
                await user.save();
            }
        }

        res.status(201).send({ message: "Project created successfully", success: true, project: newProject });
    } catch (error) {
        errorHandler(error, res);
    }
}

const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate("user_id", "full_name email");

        res.status(200).send({ message: "Projects retrieved successfully", success: true, projects });
    } catch (error) {
        errorHandler(error, res);
    }
};

const getUserProject = async (req, res) => {
    try {
        const { user_id } = req.params;

        const projects = await Project.find({ user_id })


        res.status(200).send({ projects })


    } catch (error) {
        errorHandler(error, res)
    }
}

const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id).populate("user_id", "full_name email");

        if (!project) {
            return res.status(404).send({ message: "Project not found", success: false });
        }

        res.status(200).send({ message: "Project retrieved successfully", success: true, project });
    } catch (error) {
        errorHandler(error, res);
    }
};

const updateProject = async (req, res) => {
    try {
        const { id } = req.params;



        const updatedProject = await Project.findByIdAndUpdate(id, req.body, {

            new: true,

            runValidators: true,

        });

        if (!updatedProject) {

            return res.status(404).send({ message: "Project not found", success: false });

        }

        res.status(200).send({ message: "Project updated successfully", success: true, project: updatedProject });

    } catch (error) {

        errorHandler(error, res);

    }
};

const deleteProject = async (req, res) => {

    try {

        const { id } = req.params;


        const deletedProject = await Project.findByIdAndDelete(id);

        if (!deletedProject) {

            return res.status(404).send({ message: "Project not found", success: false });

        }

        const user = await User.findOne({ projects: id });
        if (user) {
            user.projects = user.projects.filter(projectId => projectId.toString() !== id);
            await user.save();
        }

        res.status(200).send({ message: "Project deleted successfully", success: true });
    } catch (error) {
        errorHandler(error, res);
    }
};

module.exports = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    getUserProject
};
