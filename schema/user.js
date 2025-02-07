const { model, Schema } = require("mongoose")


const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    is_active: { type: Boolean, default: false },
    projects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
    activation_link: String,
    refresh_token: { type: String }
}, {
    versionKey: false,
    timestamps: true
})


module.exports = model("User", userSchema)