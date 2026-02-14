Exercise 2: Building a Simple Calculator
Objective: In this exercise, we will work on creating and experimenting with JavaScript
functions to deepen your understanding of their concepts and usage. Follow the instructions
carefully and test your code using the browser's developer console.
Exercise 2A: Declaring Functions
1. Repeat the steps from "Create an HTML File" in Exercise 1 to create a new file named
exercise2.html. In the newly created file, write a function named add that accepts two
numbers as parameters and returns their sum.
2. Write another function named subtract that accepts two numbers as parameters and
returns their difference.
3. Use your browser's developer console to call each function with sample inputs and
confirm the results.
Exercise 2B: Using Default Parameters
1. Comment out the add and subtract functions declared in the previous section “Declaring
Functions”
2. Copy and modify your add function to include a default value for the second parameter
(e.g., 5).
3. Similarly, modify the subtract function to include a default value for the second
parameter.
4. Test the updated functions by calling them with one and two arguments in the developer
console. Observe the behaviour when you omit the second argument.
Exercise 2C: Implementing Arrow Functions
1. Comment out the implementations of add and subtract from Exercise 2B.
2. Re-implement add and subtract using arrow function syntax.
3. Define two new functions, multiply and divide, using arrow function syntax.
o The multiply function should return the product of two numbers.
o The divide function should return the quotient of two numbers, where the second
argument is the divisor. Prevent division by zero by logging an error message if
the divisor is 0.
Test all four functions in the developer console to verify their functionality.
Exercise 2D: Understanding Callback Functions
1. Create a function named calculator with three parameters: num1, num2, and operation.
o num1: the first number
o num2: the second number
o operation: a callback function that takes num1 and num2 in that order and returns
the result of applying operation to them.
2. Inside calculator, call the provided callback function with the two numbers and return the
result.
3. Test your calculator function in the developer console by passing it:
o Two numbers and the add function as the callback.
o Two numbers and the divide function as the callback.
Submission:
Upload the code for Exercise 2 to the same repository you created for Exercise 1.