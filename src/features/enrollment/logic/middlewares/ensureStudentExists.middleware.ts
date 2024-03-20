import { StudentModel, StudentType } from '@fcai-sis/shared-models';
import { Request, Response, NextFunction } from 'express';
import { Document } from 'mongoose';

type MiddlewareRequest = Request<{}, {}, { studentId: string, student: StudentType & Document }>;

const ensureStudentExistsMiddleware = async (req: MiddlewareRequest, res: Response, next: NextFunction) => {
  const { studentId } = req.body;

  const student = await StudentModel.findById(studentId);

  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  req.body.student = student;

  next();
}

export default ensureStudentExistsMiddleware;
