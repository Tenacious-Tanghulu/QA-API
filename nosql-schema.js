import mongoose from 'mongoose';
const { Schema } = mongoose;

const questionSchema = new Schema({
  id: Number,
  product_id: Number,
  body: String,
  date: { type: Date, default: Date.now },
  asker_name: String,
  helpfulness: Number,
  reported: Boolean,
  answers: { type: [Number], unique: true }
});

const Question = mongoose.model('Question', questionSchema);

const answerSchema = new Schema({
  id: Number,
  question_id: Number,
  body: String,
  date: { type: Date, default: Date.now },
  answerer_name: String,
  helpfulness: Number,
  reported: Boolean,
  photos: [{ id: Number, url: String }]
});

const Answer = mongoose.model('Answer', answerSchema);
