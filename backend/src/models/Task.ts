import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
    user: mongoose.Schema.Types.ObjectId;
    title: string;
    description: string;
    status: 'pending' | 'completed';
}

const TaskSchema: Schema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, default: 'pending', enum: ['pending', 'completed'] },
}, { timestamps: true });

export default mongoose.model<ITask>('Task', TaskSchema);
