import { Request, Response } from "express";
import { studentPreferenceModel } from "../../data/models/studentPreference.model";
import {
  AcademicStudentModel,
  DepartmentModel,
  IDepartment,
  ProgramEnum,
} from "@fcai-sis/shared-models";

// Handler function to assign departments based on student preferences
const handler = async (req: Request, res: Response) => {
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
      gpa: 1,
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
      gpa: studentGpa.gpa,
    };
  });

  const preferenceIds = allStudentPreferences.flatMap((pref) =>
    pref.preferences.map((dept: IDepartment) => dept._id)
  );

  const departments = await DepartmentModel.find({
    _id: { $in: preferenceIds },
    program: ProgramEnum[0],
  });

  if (departments.length === 0) {
    return res.status(400).json({
      error: {
        message: "No departments found according to the preferences",
      },
    });
  }

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

  const maxWeight = Math.max(
    ...allStudentPreferences.map((pref) => pref.preferences.length)
  );

  const departmentThresholds = departmentsPreferencesAndTheirStudents.map(
    (dept) => {
      let totalWeightedGpa = 0;
      let totalWeight = 0;

      studentGpas.forEach((studentGpa) => {
        const studentPref = allStudentPreferences.find(
          (pref) =>
            pref.student._id.toString() === studentGpa.student._id.toString()
        );

        const studentPreferenceIndex = studentPref.preferences.findIndex(
          (preference: any) =>
            preference._id.toString() === dept.department._id.toString()
        );

        const weight = maxWeight - (studentPreferenceIndex + 1);
        totalWeightedGpa += studentGpa.gpa * weight;
        totalWeight += weight;
      });

      const weightedAvgGpa = totalWeightedGpa / totalWeight;

      return {
        department: dept.department,
        threshold: weightedAvgGpa,
        currentCount: 0,
        capacity: dept.department.capacity,
      };
    }
  );

  const sortedDepartments = departmentThresholds.sort(
    (a, b) => b.threshold - a.threshold
  );

  const assignedDepartments = allStudentPreferencesAndTheirGpa.map((pref) => {
    const student = pref.student;

    let assignedDepartment = null;

    for (const preference of pref.preferences) {
      const dept = sortedDepartments.find(
        (sortedDept) =>
          sortedDept.department._id.toString() === preference._id.toString()
      );

      if (
        dept &&
        pref.gpa >= dept.threshold &&
        dept.currentCount < dept.capacity
      ) {
        assignedDepartment = dept.department;
        dept.currentCount++;
        break;
      }
    }

    return {
      student,
      department: assignedDepartment,
    };
  });

  await Promise.all(
    assignedDepartments.map(async (assignment) => {
      await AcademicStudentModel.updateOne(
        { student: assignment.student._id },
        { major: assignment.department }
      );
    })
  );

  return res.status(200).json({
    message: "Departments assigned successfully",
  });
};

const assignDepartmentsBasedOnStudentPreferencesHandler = handler;
export default assignDepartmentsBasedOnStudentPreferencesHandler;
