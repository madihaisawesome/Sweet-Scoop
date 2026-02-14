Exercise 1A: Variable Declaration
1. Declare one variable with var, one variable with let, and one variable with const. Assign a
different value to each variable.
2. Change the value of the variable declared using let and observe the behaviour.
3. Try to reassign the value of the const variable and note what happens.
4. Wrap the invalid assignment from step3 in a try…catch block. Within catch, log the
message “Error: cannot reassign const”.
Exercise 1B: String Operations
1. Declare two string variables:
let string1 = "Hello, World!"
let string2 = "JavaScript is fun!"
2. Use a method to find the length of string1 and display it in the console.
3. Concatenate string1 and string2 and log the result in the console.
4. Create a new variable string3 by replacing the word "fun" in string2 with "awesome",
then display string3 in the console.
Exercise 1C: String Templates
1. Declare the following variables for the tasks in this part:
let name = "Alice"
let age = 25
2. Create a template literal using backticks ( ` ) and the variables name and age so that the
result reads: "My name is Alice and I am 25 years old".
Hint: Insert variables into the template literal using the ${variableName} syntax.
3. Log the resulting template string in the console.
Exercise 1D: Iteration
1. Declare two arrays, one for student names and one for ages:
const students = ["Alice", "Tom", "Charlie"]
const ages = [19, 21, 20]
2. Use a for loop to iterate through the students array by index.
3. In each iteration, reuse the same template literal format from the previous section ("My
name is ... and I am ... years old"), using matching indexes from both arrays, and log it to
the console. For example:
for (let i = 0; i < students.length; i++) {
let studentInfo = `My name is ${students[i]} and I am ${ages[i]} years old`;
console.log(studentInfo);
}
Exercise 1E: Working with Dates
1. Create a variable to store the current date using JavaScript’s Date object. This is a new
concept, so you may need to research the Date object online for this lab.
2. Log the full date in the console in the en-CA and en-US formats.
3. Use methods from the Date object to:
o Extract and log the year (e.g., 2026).
o Extract and log the month as a number (e.g., 1 for February). Note that these are
zero-indexed unlike the output we got from logging the date in step 2.
o Extract and log the day of the week from the date object (e.g., Friday).
Hint: Use the weekday option with toLocaleDateString.
4. Determine and log the current season using the extracted month value.
Hint: You may use if...else to map month numbers to seasons. Assume Northern
Hemisphere seasons:
o Winter: 11, 0, 1
o Spring: 2, 3, 4
o Summer: 5, 6, 7
o Fall: 8, 9, 10
Submission
1. Fill out the Answer_sheet.docx, including the names and UCIDs of all group members.
2. Create a new GitHub repository and upload the code for Exercise 1 to the new repository.