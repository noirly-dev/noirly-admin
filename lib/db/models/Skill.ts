import { Schema, model, models, type InferSchemaType } from "mongoose";

const skillSchema = new Schema(
  {
    label: { type: String, required: true },
    category: { type: String, required: true },
    color: { type: String, required: true },
    iconKey: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type SkillDocument = InferSchemaType<typeof skillSchema>;

export const SkillModel = models.Skill ?? model("Skill", skillSchema);
