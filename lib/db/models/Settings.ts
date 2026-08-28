import { Schema, model, models, type InferSchemaType } from "mongoose";

const settingsSchema = new Schema(
  {
    slug: { type: String, default: "portfolio", unique: true },
    themeId: { type: String, default: "gold" },
  },
  { timestamps: true },
);

export type SettingsDocument = InferSchemaType<typeof settingsSchema>;

export const SettingsModel =
  models.Settings ?? model("Settings", settingsSchema);
