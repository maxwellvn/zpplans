import mongoose, { Schema, model, models } from 'mongoose';

const RegistrationSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
  },
  kingschat: {
    type: String,
    required: true,
    trim: true,
  },
  zone: {
    type: String,
    required: true,
  },
  group: {
    type: String,
    required: true,
  },
  church: {
    type: String,
    required: true,
  },
  attendanceType: {
    type: String,
    enum: ['physical', 'online'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Registration = models.Registration || model('Registration', RegistrationSchema);

export default Registration;
