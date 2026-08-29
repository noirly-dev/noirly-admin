import { Schema, model, models, type InferSchemaType } from "mongoose";

const mediaSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    contentType: { type: String, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true },
);

export type MediaDoc = InferSchemaType<typeof mediaSchema>;

export const Media =
  models.Media ?? model("Media", mediaSchema);
