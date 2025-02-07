const { model, Schema } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const projectSchema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
        project_name: { type: String, required: true }, 
        project_link: { type: String, default: () => uuidv4() }, 
        description: { type: String }, 
    },
    {
        versionKey: false,
        timestamps: true, 
    }
);

module.exports = model("Project", projectSchema);
