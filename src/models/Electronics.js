import { Schema, model, Types } from "mongoose";

const electroSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 10,
  },
  type: {
    type: String,
    required: true,
    minLength: 2
  },
  damages: {
    type: String,
    required: true,
    minLength: 10,
  },
  image: {
    type: String,
    required: true,
    validate: /^https?:\/\//
  },
  description: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 200
  },
  production: {
    type: Number,
    required: true,
    min: 1900,
    max: 2023
  },
  exploitation: {
    type: Number,
    required: true,
    min: 0
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  buyingList: [
    {
      type: Types.ObjectId,
      ref: "User",
    },
  ],
  owner: {
    type: Types.ObjectId,
    ref: "User",
  },
});

const Electro = model("Electro", electroSchema);

export default Electro;
