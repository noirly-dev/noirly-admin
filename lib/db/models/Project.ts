import { Schema, model, models, type InferSchemaType } from "mongoose";

const projectSchema = new Schema(
  {
    title: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    stack: [String],
    url: { type: String, required: true },
    githubUrl: { type: String, default: "#" },
    category: { type: String, default: "Web" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    featureGraphic: { type: String, default: null },
    featureGraphicDark: { type: String, default: null },
    logo: { type: String, default: null },
    logoDark: { type: String, default: null },
  },
  { timestamps: true },
);

export type ProjectDocument = InferSchemaType<typeof projectSchema>;

export const ProjectModel =
  models.Project ?? model("Project", projectSchema);
