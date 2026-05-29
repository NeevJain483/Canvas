import mongoose, { Schema, model } from "mongoose";

if (!process.env.DATABASE_URL_MONGO) {
  throw new Error("DATABASE_URL_MONGO environment variable is not set");
}

export const initailizeMongoDB = async () => {
  await mongoose
    .connect(process.env.DATABASE_URL_MONGO || "", {
      directConnection: true,
    })
    .then(() => console.log("mongo is ready to go"))
    .catch((err) => console.log(err));
};

type UUID = `${string}-${string}-${string}-${string}-${string}`;

export interface IProject {
  project_id: UUID;
  baseImageUrl?: string;
  strokes: Record<string, any>[];
  lastUpdated: Date;
  updatedBy: string;
}

const ProjectSchema = new Schema<IProject>(
  {
    project_id: {
      type: String,
      required: true,
      unique: true,
    },
    baseImageUrl: {
      type: String,
      default: null,
    },
    strokes: {
      type: [],
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    updatedBy: {
      type: String,
      required: true,
      default:"System"
    },
  },
  {
    collection: "canvas_states",
    timestamps: false,
  },
);

export const ProjectModel = model<IProject>("Project", ProjectSchema);
