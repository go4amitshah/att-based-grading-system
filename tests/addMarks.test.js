import { addMarks, calculateSPI } from "../src/lib.mjs";

describe("Marks Calculation", () => {
  let student;

  beforeEach(() => {
    student = {
      Name: "A Student",
      Enrollment: "12345",
      Subjects: {
        Math: {
          IA: { Score: 10, Max: 20 },
          UA: { Score: 30, Max: 80 },
          cr: { Score: 4, Max: 4 },
        },
        Science: {
          IA: { Score: 15, Max: 20 },
          UA: { Score: 40, Max: 80 },
          cr: { Score: 3, Max: 4 },
        },
      },
    };
  });

  test("Should correctly apply attendance marks", () => {
    addMarks(student, ["attendance"], 2);
    expect(student.Subjects.Math.IA.Score).toBe(12);
    expect(student.Subjects.Science.IA.Score).toBe(17);
  });

  test("Should not modify cr category", () => {
    addMarks(student, ["attendance"], 2);
    expect(student.Subjects.Math.cr.Score).toBe(4);
  });

  test("Should correctly calculate SPI", () => {
    addMarks(student, ["attendance"], 2);
    calculateSPI(student);
    expect(parseFloat(student.SPI)).toBeGreaterThan(0);
  });
});
