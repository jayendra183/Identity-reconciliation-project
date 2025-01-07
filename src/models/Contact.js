import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  email: String,
  phoneNumber: String,
  linkedId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact'
  },
  linkPrecedence: {
    type: String,
    enum: ['primary', 'secondary'],
    default: 'primary'
  },
  deletedAt: Date
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

// Ensure at least email or phoneNumber is provided
contactSchema.pre('save', function(next) {
  if (!this.email && !this.phoneNumber) {
    next(new Error('Either email or phoneNumber must be provided'));
  }
  next();
});

export const Contact = mongoose.model('Contact', contactSchema);