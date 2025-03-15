import { isStudentPassInAllSubjects } from "../src/lib.mjs";

describe("Student Pass Check", () => {
  test("Should return true if student passed all subjects", () => {
    const student = {
      Enrollment: 21012250210001,
      Name: "AARSH VACHHANI",
      Att: 7,
      Subjects: {
        "PROJECT II": {
          PR: { Score: 90, Max: 100 },
        },
        MCAD: {
          cr: { Score: 5, Max: null },
          TH: { Score: 50, Max: 50 },
          PR: { Score: 38, Max: 50 },
        },
        IOT: {
          cr: { Score: 4, Max: null },
          TH: { Score: 39, Max: 50 },
          PR: { Score: 45, Max: 50 },
        },
        ML: {
          cr: { Score: 5, Max: null },
          TH: { Score: 30, Max: 50 },
          PR: { Score: 44, Max: 50 },
        },
        Seminar: {
          cr: { Score: 2, Max: null },
          PR: { Score: 90, Max: 100 },
        },
      },
    };

    expect(isStudentPassInAllSubjects(student)).toBe(true);
  });

  test("Should return false if student fails in any subject", () => {
    const student = {
      Enrollment: 21012250210002,
      Name: "FAILED STUDENT",
      Att: 5,
      Subjects: {
        "PROJECT II": {
          PR: { Score: 90, Max: 100 },
        },
        MCAD: {
          cr: { Score: 5, Max: null },
          TH: { Score: 5, Max: 50 }, // Failed
          PR: { Score: 38, Max: 50 },
        },
        IOT: {
          cr: { Score: 4, Max: null },
          TH: { Score: 39, Max: 50 },
          PR: { Score: 45, Max: 50 },
        },
        ML: {
          cr: { Score: 5, Max: null },
          TH: { Score: 30, Max: 50 },
          PR: { Score: 44, Max: 50 },
        },
        Seminar: {
          cr: { Score: 2, Max: null },
          PR: { Score: 90, Max: 100 },
        },
      },
    };

    expect(isStudentPassInAllSubjects(student)).toBe(false);
  });
});
