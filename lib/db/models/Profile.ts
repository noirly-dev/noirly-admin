import { Schema, model, models, type InferSchemaType } from "mongoose";

const contactEntrySchema = new Schema(
  { label: String, href: String },
  { _id: false },
);

const profileSchema = new Schema(
  {
    slug: { type: String, default: "default", unique: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    badge: { type: String, required: true },
    title: { type: String, required: true },
    titleAccent: { type: String, required: true },
    description: { type: String, required: true },
    heroStats: [{ value: String, label: String }],
    techChips: [String],
    aboutTitle: { type: String, required: true },
    aboutBio: { type: String, required: true },
    aboutPoints: [String],
    heroHighlights: [String],
    experienceSubtitle: String,
    secondaryCta: String,
    stackSubtitle: String,
    servicesSubtitle: String,
    workSubtitle: String,
    ctaTitle: String,
    ctaSubtitle: String,
    contact: {
      email: contactEntrySchema,
      linkedin: contactEntrySchema,
      github: contactEntrySchema,
    },
    profileImage: { type: String, default: null },
  },
  { timestamps: true },
);

export type ProfileDocument = InferSchemaType<typeof profileSchema>;

export const ProfileModel =
  models.Profile ?? model("Profile", profileSchema);
