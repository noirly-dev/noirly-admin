import { Schema, model, models, type InferSchemaType } from "mongoose";

const experienceSchema = new Schema(
  {
    role: { type: String, required: true },
    company: { type: String, required: true },
    period: { type: String, required: true },
    achievements: [String],
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type ExperienceDocument = InferSchemaType<typeof experienceSchema>;

export const ExperienceModel =
  models.Experience ?? model("Experience", experienceSchema);
