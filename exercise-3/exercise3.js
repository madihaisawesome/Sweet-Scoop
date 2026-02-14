/* --- Exercise 3A: Arrays and Basic Methods --- */

// 4. Initial Array
let classRoster = ["Alice", "Tom", "Charlie", "Diana", "Evan"];

// 5. toString method
console.log("Array as string:", classRoster.toString());

// 6. Confirm original array is unchanged
console.log("Original roster after toString:", classRoster);

// 7. Add Fiona and Nancy
classRoster.push("Fiona", "Nancy");

// 8. Remove the first student (Alice)
const removedStudent = classRoster.shift();
console.log("Removed student:", removedStudent);

// 9. Log updated array
console.log("Updated classRoster:", classRoster);

// 10. Log length
console.log("Total students in roster:", classRoster.length);


/* --- Exercise 3B: Objects with Nested Structures --- */

// 1. Create the classInfo object
const classInfo = {
    className: 'ENSF381: Full-Stack Web Development',
    instructor: 'Dr. Smith',
    students: classRoster,
    details: {
        semester: 'Winter',
        year: 2025
    }
};

// 2. Add schedule property
classInfo.schedule = ["Monday", "Wednesday", "Friday"];

// 3. Update instructor
classInfo.instructor = 'Dr. Abdellatif';

// 4. Log specific properties
console.log("Class Name:", classInfo.className);
console.log("Instructor:", classInfo.instructor);
console.log("Students Array:", classInfo.students);

// 5. Access nested property
console.log("Semester:", classInfo.details.semester);

// 6. Log full object
console.log("Full classInfo Object:", classInfo);

// 7. Destructure className and students
const { className, students } = classInfo;
console.log("Destructured Class Name:", className);
console.log("Destructured Students:", students);

// 8. Destructure nested details
const { semester, year } = classInfo.details;
console.log(`Destructured Details: Semester ${semester}, Year ${year}`);

// 9 & 10. Destructure array with rest operator
// student1 = Tom, student2 = Charlie (since Alice was shifted out)
const [student1, student2, ...remainingStudents] = classRoster;

// 11. Log results
console.log("Student 1:", student1);
console.log("Student 2:", student2);
console.log("Remaining Students:", remainingStudents);