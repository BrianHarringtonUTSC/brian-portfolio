import mongoose, { Schema, Document } from "mongoose";

export interface IPresenter {
  name: string;
  link: string;
}

export interface IPRGSession extends Document {
  date: string;
  paperTitle: string;
  paperLink: string;
  slidesLink?: string;
  resources?: string;
  presenter: IPresenter[];
  academicYear: string;
  createdAt: Date;
  updatedAt: Date;
}

const presenterSchema = new Schema<IPresenter>(
  {
    name: {
      type: String,
      required: [true, "Presenter name is required"],
      trim: true,
      minlength: [1, "Presenter name cannot be empty"],
    },
    link: {
      type: String,
      required: [true, "Presenter link is required"],
      trim: true,
      minlength: [1, "Presenter link cannot be empty"],
    },
  },
  { _id: false }
);

const prgSessionSchema = new Schema<IPRGSession>(
  {
    date: {
      type: String,
      required: [true, "Date is required"],
      match: [/^\d{2}-\d{2}-\d{2}$/, "Date must be in DD-MM-YY format"],
    },
    paperTitle: {
      type: String,
      required: [true, "Paper title is required"],
      trim: true,
      minlength: [1, "Paper title cannot be empty"],
    },
    paperLink: {
      type: String,
      required: [true, "Paper link is required"],
      trim: true,
    },
    slidesLink: {
      type: String,
      trim: true,
    },
    resources: {
      type: String,
      trim: true,
    },
    presenter: {
      type: [presenterSchema],
      required: [true, "At least one presenter is required"],
      validate: {
        validator: (v: IPresenter[]) => v && v.length > 0,
        message: "At least one presenter is required",
      },
    },
    academicYear: {
      type: String,
      required: [true, "Academic year is required"],
      index: true,
      match: [/^\d{4}-\d{4}$/, "Academic year must be in YYYY-YYYY format"],
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for efficient queries
prgSessionSchema.index({ academicYear: 1, date: 1 });

export default mongoose.models.PRGSession ||
  mongoose.model<IPRGSession>("PRGSession", prgSessionSchema);
