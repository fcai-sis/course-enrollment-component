import mongoose, { Schema, Document } from 'mongoose';

interface IStudentPreference extends Document {
  studentId: mongoose.Types.ObjectId;
  preferences: mongoose.Types.ObjectId[];
}

const studentPreferenceSchema: Schema = new Schema({
  studentId: { type: mongoose.Types.ObjectId, ref: 'Student', required: true },
  preferences: [{ type: mongoose.Types.ObjectId, ref: 'Department', required: true }]
});

const StudentPreferenceModel = mongoose.model<IStudentPreference>('StudentPreference', studentPreferenceSchema);
export default StudentPreferenceModel;
