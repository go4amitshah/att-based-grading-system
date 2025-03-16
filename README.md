# Grading System
## Overview
This project is a grading system that processes student marks from an Excel sheet, calculates SPI (Semester Performance Index), and exports the results back to an Excel file. It also handles conditional bonus marks based on attendance and pass/fail status.

## Features
- Parses student data from an Excel file
- Calculates attendance marks
- Adds marks based on predefined categories
- Computes SPI for each student
- Determines if a student has passed all subjects
- Exports the final results to an Excel sheet

## Installation

Ensure you have Node.js installed, then install dependencies:

```sh
npm install
```

## Usage

### Running the Script
To process the student data and generate results:

```sh
cd src
```

```sh
node index.mjs
```

### Input Format (Excel Data)
The input should be an Excel file containing student details, including subjects and their respective marks.

Example JSON representation of a student:

```json
{
  "Enrollment": 21012250210001,
  "Name": "AARSH VACHHANI",
  "Att": 7,
  "Subjects": {
    "PROJECT II": {
      "PR": { "Score": 90, "Max": 100 }
    },
    "MCAD": {
      "cr": { "Score": 5, "Max": null },
      "TH": { "Score": 9, "Max": 50 },
      "PR": { "Score": 38, "Max": 50 }
    }
  }
}
```

### Output Format (Excel Data)
The output Excel sheet will include:
- Name
- Enrollment Number
- Subject-wise marks for each category
- Subject-wise grades
- Total SPI

## Functions

### `parseExcel()`
Parses the input Excel file and extracts student data.

### `calculateAttendanceMarks(student)`
Calculates attendance-based bonus marks.

### `addMarks(student, categories, marks)`
Adds marks to a student for specified categories.

### `calculateSPI(student)`
Computes the SPI based on student marks.

### `isStudentPassInAllSubjects(student)`
Checks whether a student has passed all subjects.

### `writeStudents(data)`
Saves processed student data to a JSON file.

### `writeStudentsToExcel(data, filename)`
Exports the final results to an Excel sheet.

## Testing

To run unit tests:

```sh
npm test
```


