Exercise 3: Managing Data with JavaScript
Objective: The objective of this exercise is to help students practice managing and manipulating
data in JavaScript using arrays, objects, and destructuring. We will learn how to create, update,
and access structured data, enabling them to build dynamic and organized programs.
Exercise 3A: Arrays and Basic Methods
1. Repeat the steps from "Create an HTML File" in Exercise 1 to create a new file named
exercise3.html.
2. Create a JavaScript file named exercise3.js within the same folder as exercise3.html.
3. Replace the <script>…</script> block with <script src="./exercise3.js" defer></script>
All subsequent steps in this exercise should be done within exercise3.js.
4. Declare an array named classRoster containing the following student names: Alice, Tom,
Charlie, Diana, Evan
5. Use the toString method to convert the array into a string and log it to the console.
6. Log the initial classRoster to show that it remains unchanged after using toString.
7. Use a method (e.g., push) to add two more students: Fiona and Nancy.
8. Remove the first student in the list (Alice) using the shift method and log their name to
the console. Do not remove a name by directly editing the array declaration.
Hint: the shift method is used to remove the first element from an array and return it.
9. Log the updated array to the console and confirm all changes.
10. Log the length of the updated classRoster array to confirm the total number of students.
Exercise 3B: Objects with Nested Structures
1. Create an object named classInfo with the following properties:
a. className: A string, 'ENSF381: Full-Stack Web Development'.
b. instructor: A string, 'Dr. Smith'.
c. students: The classRoster array created earlier.
d. details: A nested object with these properties:
§ semester: 'Winter'
§ year: 2025
2. Add a new property, schedule, to the classInfo object. This property should be an array
containing the class meeting days: Monday, Wednesday, Friday.
3. Update the instructor property to 'Dr. Abdellatif'. Use the appropriate syntax for this
change (e.g., classInfo.instructor = 'Dr.Abdellatif'). Do not directly re-declare the object.
4. Log the values of the className, instructor, and students properties to the console.
5. Access and log the semester property from the nested details object.
6. Log the updated classInfo object to confirm all changes.
7. Destructure the className and students properties from classInfo into individual
variables. Then, log these variables to the console to confirm their values.
8. Destructure the semester and year properties from the nested details object in classInfo
into variables. Then, log these variables to confirm they are correctly assigned.
9. Destructure the first two student names from the classRoster array into variables named
student1 and student2.
10. After destructuring, student1 and student2 should contain the first two names, and
remainingStudents should include the rest.
11. Log student1, student2, and remainingStudents to confirm their values.
Submission:
1. Upload the code for Exercise 3 to the same repository you created for Exercise 1.
2. Compress your Exercise 1, Exercise 2, and Exercise 3 files into a single zip file and
upload the compressed file to D2L. Also, upload the completed Answer_sheet.docx.