import {
  addMarks,
  calculateAttendanceMarks,
  calculateSPI,
  isStudentPassInAllSubjects,
  parseExcel,
  writeStudents,
  writeStudentsToExcel,
} from "./lib.mjs";

const data = parseExcel();

data.forEach((student) => {
  const attendanceMarks = calculateAttendanceMarks(student);
  if (isStudentPassInAllSubjects(student)) {
    addMarks(student, ["attendance", "extraBonus"], attendanceMarks);
  } else {
    addMarks(student, ["attendance", "hodBonus"], attendanceMarks);
  }
  calculateSPI(student);
});

writeStudents(data);

writeStudentsToExcel(data, "students_results.xlsx");
