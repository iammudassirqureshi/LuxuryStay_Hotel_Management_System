import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    totalAmount: { type: Number, required: true },
    services: { type: [Object] } // Example: [{ service: 'Laundry', amount: 200 }]
  },
  { timestamps: true }
);

const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;
