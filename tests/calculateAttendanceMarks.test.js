import { calculateAttendanceMarks } from "../src/lib.mjs";

describe("Attendance Marks Calculation", () => {
  let student;

  beforeEach(() => {
    student = {
      Name: "John bhai Doe",
      Att: 85,
    };
  });

  test("Should return correct attendance marks", () => {
    expect(calculateAttendanceMarks(student)).toBe(7);
  });
});
