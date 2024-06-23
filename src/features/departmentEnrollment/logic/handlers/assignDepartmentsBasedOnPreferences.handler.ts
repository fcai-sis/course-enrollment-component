import { Request, Response } from "express";
import { studentPreferenceModel } from "../../data/models/studentPreference.model";
import {
  AcademicStudentModel,
  DepartmentModel,
  IDepartment,
} from "@fcai-sis/shared-models";

type HandlerRequest = Request<{}, {}, {}>;
// TODO: this can probably be redone a lot better by making the academic student the FK instead of the student
const handler = async (req: HandlerRequest, res: Response) => {
  const allStudentPreferences = await studentPreferenceModel.find();
  if (allStudentPreferences.length === 0) {
    return res.status(400).json({
      error: {
        message: "No student preferences found",
      },
    });
  }
  const studentGpas = await AcademicStudentModel.find(
    {
      student: { $in: allStudentPreferences.map((pref) => pref.student._id) },
    },
    {
      currentGpa: 1,
    }
  ).populate("student");

  if (studentGpas.length === 0) {
    return res.status(400).json({
      error: {
        message: "No student GPAs found",
      },
    });
  }

  const allStudentPreferencesAndTheirGpa = allStudentPreferences.map((pref) => {
    const studentGpa = studentGpas.find(
      (studentGpa) =>
        studentGpa.student._id.toString() === pref.student._id.toString()
    );

    return {
      ...pref.toObject(),
      gpa: studentGpa.currentGpa,
    };
  });

  const preferenceIds = allStudentPreferences.flatMap((pref) =>
    pref.preferences.map((dept: IDepartment) => dept._id)
  );

  // find all departments that are in the preferences (preferences is an array of department ids)
  const departments = await DepartmentModel.find({
    _id: { $in: preferenceIds },
  });

  if (departments.length === 0) {
    return res.status(400).json({
      error: {
        message: "No departments found according to the preferences",
      },
    });
  }

  // return each department alongside the students who have this department in their preferences
  const departmentsPreferencesAndTheirStudents = await Promise.all(
    departments.map(async (dept) => {
      const students = await studentPreferenceModel.find({
        preferences: dept._id,
      });
      return {
        department: dept,
        students: students.map((student) => student.student),
      };
    })
  );

  if (departmentsPreferencesAndTheirStudents.length === 0) {
    return res.status(400).json({
      error: {
        message: "No students found according to the preferences",
      },
    });
  }

  // assign each department a threshold based on the average GPA of the students who have this department in their preferences
  const departmentThresholds = departmentsPreferencesAndTheirStudents.map(
    (dept) => {
      const students = studentGpas.filter((studentGpa) =>
        dept.students.find(
          (student) =>
            student._id.toString() === studentGpa.student._id.toString()
        )
      );
      const avgGpa =
        students.reduce((acc, student) => acc + student.currentGpa, 0) /
        students.length;
      return {
        department: dept.department,
        threshold: avgGpa,
      };
    }
  );

  // sort departments based on their threshold
  const sortedDepartments = departmentThresholds.sort(
    (a, b) => b.threshold - a.threshold
  );

  // assign students to departments based on their preferences and assign them the first threshold they qualify for
  const assignedDepartments = allStudentPreferencesAndTheirGpa.map((pref) => {
    const student = pref.student;

    let assignedDepartment = null;
    for (const dept of sortedDepartments) {
      if (
        pref.preferences.toString().includes(dept.department._id.toString())
      ) {
        if (pref.gpa >= dept.threshold) {
          assignedDepartment = dept.department;

          break;
        }
      }
    }
    return {
      student,
      department: assignedDepartment,
    };
  });

  // update the student's department in the database
  await Promise.all(
    assignedDepartments.map(async (assignment) => {
      await AcademicStudentModel.updateOne(
        { student: assignment.student._id },
        { currentDepartment: assignment.department }
      );
    })
  );

  return res.status(200).json({
    message: "Departments assigned successfully",
  });
};

const assignDepartmentsBasedOnStudentPreferencesHandler = handler;
export default assignDepartmentsBasedOnStudentPreferencesHandler;
