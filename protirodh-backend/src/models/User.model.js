import mongoose from "mongoose";

import { v4 as uuidv4 } from "uuid"; 

const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
      default: uuidv4, // automatically generates a unique ID
    },

    nid: {
      type: String,
    },

    b_group: {
      type: String,
    },
    b_id: {
      type: String,
    },

    gender: {
      type: String,
    },

    name: {
      type: String,
      required: true,
      default: "Protirodh_User",
    },

    dob: {
      type: String,
    },

    f_name: {
      type: String,
    },

    m_name: {
      type: String,
    },
    phone_number: {
      type: String,
    },

    contact: {
      division: { type: String },
      zila: { type: String },
      upzila: { type: String },
      village: { type: String },
      house: { type: String },
    },

    vaccines: [
      {
        id: { type: String },
        apply_date: { type: String },
        center: {
          name: { type: String },
          staff_name: { type: String },
          staff_uid: { type: String },
        },
        doses: [
          {
            name: { type: String },
            date: { type: String },
            status: {
              type: String,
              enum: ["Taken", "Not Taken"],
              default: "Not Taken",
            },
          },
        ],
      },
    ],

    email: {
      type: String,
      required: true,
      default: "",
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel;
