const { Schema, model } = require("mongoose");

const ModelSchema = new Schema(
    {
        project_id: { type: String, ref: "Project", required: true },
        schema_name: { type: String, max: [10], required: true },
        data: { type: [Schema.Types.Mixed], required: true }, // Use Mixed type to store dynamic data
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

module.exports = model("Model", ModelSchema);
