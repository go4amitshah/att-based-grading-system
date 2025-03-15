import * as xlsx from "xlsx";
import * as fs from "fs";
import { set_fs } from "xlsx/xlsx.mjs";

set_fs(fs);

export function parseExcel() {
  try {
    const filePath = `${process.cwd()}/input.xlsx`;
    const buffer = fs.readFileSync(filePath);
    const workbook = xlsx.read(buffer, { type: "buffer" });

    if (!workbook.SheetNames.length) {
      console.error("Error: No sheets found");
      return null;
    }

    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    if (!sheet) {
      console.error("Error: Sheet not found");
      return null;
    }

    if (!sheet["!ref"]) {
      console.error("Error: Unable to detect sheet range.");
      return null;
    }

    const rawData = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: "" });

    if (rawData.length < 4) {
      console.error("Error: Not enough data rows.");
      return null;
    }

    const mainHeaders = rawData[0].map(formatName);
    const subHeaders = rawData[1].map(formatName);
    const maxMarks = rawData[2];

    let currentSubject = "";
    for (let i = 2; i < mainHeaders.length; i++) {
      if (mainHeaders[i]) currentSubject = mainHeaders[i];
      else mainHeaders[i] = currentSubject;
    }

    const students = rawData.slice(3).map((row) => {
      const student = {
        Enrollment: row[0] || "",
        Name: String(row[1] || ""),
        Att: row[2] || "",
        Subjects: {},
      };

      for (let i = 3; i < row.length; i++) {
        const subject = formatName(mainHeaders[i] || "");
        const category = formatName(subHeaders[i] || "");
        const maxMark = maxMarks[i] || null;
        const score = row[i] || "";

        if (!subject || subject.toLowerCase() === "att") continue;
        if (!category || category.toLowerCase() === "unknown") continue;

        if (!student.Subjects[subject]) {
          student.Subjects[subject] = {};
        }

        student.Subjects[subject][category] = { Score: score, Max: maxMark };
      }

      return student;
    });

    fs.writeFileSync("students.json", JSON.stringify(students, null, 2));

    return students;
  } catch (error) {
    console.error("Error reading Excel file:", error);
    return null;
  }
}

export function formatName(name) {
  return String(name || "")
    .replace(/[\n↵]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function isStudentPassInAllSubjects(student) {
  let isPassInAll = true;
  for (const subject in student.Subjects) {
    for (const category in student.Subjects[subject]) {
      const { Score, Max } = student.Subjects[subject][category];
      if (Score < (35 * Max) / 100) {
        isPassInAll = false;
        break;
      }
    }
  }
  return isPassInAll;
}

export function calculateAttendanceMarks(student) {
  return student.Att >= 7 ? 7 : student.Att;
}

export function readStudents() {
  try {
    const data = fs.readFileSync("students.json", "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading students.json:", error);
    return [];
  }
}

export function writeStudents(data) {
  try {
    fs.writeFileSync("output.json", JSON.stringify(data, null, 2), "utf-8");
    console.log("Updated data saved to output.json");
  } catch (error) {
    console.error("Error writing to output.json:", error);
  }
}

export function addMarks(student, types, attendanceMarks) {
  let failedSubjects = [];
  let failedCategory = null;

  const gradeTable = [
    { min: 95, grade: "O+++", points: 10 },
    { min: 90, grade: "O++", points: 9.5 },
    { min: 85, grade: "O+", points: 9 },
    { min: 80, grade: "O", points: 8.5 },
    { min: 75, grade: "A++", points: 8 },
    { min: 70, grade: "A+", points: 7.5 },
    { min: 65, grade: "A", points: 7 },
    { min: 60, grade: "B++", points: 6.5 },
    { min: 55, grade: "B+", points: 6 },
    { min: 50, grade: "B", points: 5.5 },
    { min: 45, grade: "C", points: 5 },
    { min: 40, grade: "D", points: 4.5 },
    { min: 35, grade: "E", points: 4 },
    { min: 0, grade: "F", points: 0 },
  ];

  for (const subject in student.Subjects) {
    for (const category in student.Subjects[subject]) {
      let entry = student.Subjects[subject][category];
      let { Score, Max } = entry;
      let passMarks = Math.ceil((35 * Max) / 100);
      if (category === "cr") continue;
      if (types.includes("attendance")) {
        Score = Math.min(Max, Score + attendanceMarks);
      }

      if (Score < passMarks) {
        failedSubjects.push(subject);
        failedCategory = category;
      }

      entry.Score = Score;
    }
  }

  if (types.includes("hodBonus") && failedSubjects.length === 1) {
    const subject = failedSubjects[0];
    const category = failedCategory;
    let entry = student.Subjects[subject][category];
    let { Score, Max } = entry;
    let passMarks = Math.ceil((35 * Max) / 100);

    if (Score + 2 >= passMarks) {
      entry.Score = Math.min(Max, Score + 2);
      types = types.filter((type) => type !== "extraBonus");
    }
  }

  for (const subject in student.Subjects) {
    let total = 0;
    let maxTotal = 0;

    for (const category in student.Subjects[subject]) {
      let entry = student.Subjects[subject][category];
      total += entry.Score;
      maxTotal += entry.Max;
    }

    if (types.includes("extraBonus")) {
      total = Math.min(maxTotal, total + 2);
    }

    student.Subjects[subject] = {
      ...student.Subjects[subject],
      Total: { Score: total, Max: maxTotal },
    };
  }

  for (const subject in student.Subjects) {
    for (const category in student.Subjects[subject]) {
      let entry = student.Subjects[subject][category];
      let { Score, Max } = entry;

      if (!Max || Max === 0) continue;

      let percentage = (Score / Max) * 100;
      let gradeEntry =
        gradeTable.find((g) => percentage >= g.min) ||
        gradeTable[gradeTable.length - 1];

      entry.Grade = gradeEntry.grade;
      entry.GradePoints = gradeEntry.points;
    }
  }
}

export function calculateSPI(student) {
  let totalWeightedPoints = 0;
  let totalCredits = 0;
  for (const subject in student.Subjects) {
    const subjectData = student.Subjects[subject];

    let credits = subjectData.cr?.Score ?? 0;

    if (credits === 0 || credits === null) continue;

    let gradePoints = subjectData.Total?.GradePoints ?? 0;
    totalWeightedPoints += gradePoints * credits;
    totalCredits += credits;
  }

  student.SPI =
    totalCredits > 0 ? (totalWeightedPoints / totalCredits).toFixed(2) : "0.00";
}
export function writeStudentsToExcel(students, filePath) {
  const formattedData = students.map((student) => {
    const row = {
      Name: student.Name,
      Enrollment: student.Enrollment,
    };

    for (const subject in student.Subjects) {
      for (const category in student.Subjects[subject]) {
        if (category === "Total" || category === "cr") continue;
        const entry = student.Subjects[subject][category];

        row[`${subject} - ${category} Marks`] = entry.Score ?? "";
      }

      if (student.Subjects[subject]["Total"]) {
        row[`${subject} Total Marks`] =
          student.Subjects[subject]["Total"].Score ?? "";
        row[`${subject} Total Grade`] =
          student.Subjects[subject]["Total"].Grade ?? "";
      }
    }

    row["SPI"] = student.SPI ?? "";

    return row;
  });

  const worksheet = xlsx.utils.json_to_sheet(formattedData);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, "Student Results");

  xlsx.writeFile(workbook, filePath);

  console.log(`Excel file saved: ${filePath}`);
}
