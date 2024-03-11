import mongoose, { Schema, models } from "mongoose";

const sharedLinkSchema = new Schema(
  {
    link: {
      type: String,
      required: true,
    },
    sharedBy: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false
    }
  }
);

const SharedLink = models.SharedLink || mongoose.model("SharedLink", sharedLinkSchema);
export default SharedLink;
