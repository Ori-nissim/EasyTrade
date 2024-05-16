const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const portfolioSchema = new Schema({
    stockSymbol: { type: String, required: true },
    averageBuyingPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
  });
  
const tradeSchema = new Schema({
  symbol: { type: String, required: true },
  transactionType: { type: String, enum: ['Buy', 'Sell'], required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  reasonForTransaction: { type: String, required: true},
});

const userSchema = new Schema({
  name: { type: String, minlength: 2, maxlength: 50, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String }, 
  token: { type: String },
  isGoogleUser: { type: Boolean, default: false },
  trades: [tradeSchema],
  portfolio: [portfolioSchema],
});

userSchema.index({ email: 1 }); // Create index on email for efficiency

module.exports = mongoose.model('User', userSchema);
