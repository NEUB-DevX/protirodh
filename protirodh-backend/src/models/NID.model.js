import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  division: { type: String, required: true },
  zila: { type: String, required: true },
  upazila: { type: String, required: true },
  village: { type: String, required: true },
  holding_number: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
  nid: { type: String, required: true, unique: true },
  b_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  father_name: { type: String, required: true },
  mother_name: { type: String, required: true },
  dob: { type: Date, required: true },
  blood_group: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone_number: { type: String, required: true },
  address: { type: addressSchema, required: true },
  birth_place: { type: String, required: true },
  gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
}, { timestamps: true });

const nidModel = mongoose.model('nid', userSchema);

export default nidModel;
