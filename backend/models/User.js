const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    // NEW — Role field added!
    // Only two values allowed — user or admin
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'       // Everyone is a regular user by default
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);