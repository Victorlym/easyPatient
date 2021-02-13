const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

ObjectId = Schema.ObjectId;
const patientSchema = new Schema({
  avatar: String,
  name: { type: String, required: true },
  specialist: { type: String, default: null },
  sex: { type: String, default: null },
  startDate: { type: Date, default: Date.now },
  cellPhone: { type: String, default: null },
  email: { type: String, default: null },
  doctorName: {type: String,default: null},
  doctor: {type: ObjectId,default: null},
  directReports: { type: [ObjectId], default: [] }
});

patientSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("User", patientSchema);
