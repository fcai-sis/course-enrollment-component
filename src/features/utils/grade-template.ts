import ExcelJS from "exceljs";

export const generateExcelTemplate = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Grading Template");

  // Add column headers
  worksheet.columns = [
    { header: "studentId", key: "studentId", width: 20 },
    { header: "termWorkMark", key: "mark", width: 20 },
    { header: "finalExamMark", key: "mark", width: 20 },
  ];

  return workbook;
};
