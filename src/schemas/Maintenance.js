import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema(
  {
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    issue: { type: String, required: true },
    status: { type: String, enum: ['pending', 'in-progress', 'resolved'], default: 'pending' }
  },
  { timestamps: true }
);

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);
export default Maintenance;
