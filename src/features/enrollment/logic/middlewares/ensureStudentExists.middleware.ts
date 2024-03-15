import { StudentModel } from '@fcai-sis/shared-models';
import { Request, Response, NextFunction } from 'express';

type MiddlewareRequest = Request<{}, {}, { studentId: string }>;

const ensureStudentExistsMiddleware = async (req: MiddlewareRequest, res: Response, next: NextFunction) => {
  const { studentId } = req.body;

  const student = await StudentModel.findById(studentId);

  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  req.context.student = student;

  next();
}

export default ensureStudentExistsMiddleware;
