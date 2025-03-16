import { writeStudentsToExcel } from "../src/lib.mjs";
import fs from "fs";
import xlsx from "xlsx";

describe("Write Students to Excel", () => {
  let students;

  beforeEach(() => {
    students = [
      {
        Name: "John bhai Doe",
        Enrollment: "12345",
        Subjects: {
          Math: {
            IA: { Score: 10, Max: 20, Grade: "B" },
            UA: { Score: 30, Max: 80, Grade: "C" },
            Total: { Score: 40, Max: 100, Grade: "B+" },
            cr: { Score: 4, Max: 4 },
          },
        },
        SPI: "7.50",
      },
    ];
  });

  test("Should generate a valid Excel file", () => {
    const filePath = "./students_test.xlsx";
    writeStudentsToExcel(students, filePath);

    expect(fs.existsSync(filePath)).toBe(true);

    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    expect(data.length).toBe(1);
    expect(data[0]["Name"]).toBe("John Doe");
    expect(data[0]["Enrollment"]).toBe("12345");
  });

  afterEach(() => {
    fs.unlinkSync("./students_test.xlsx");
  });
});
