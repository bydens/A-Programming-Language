# Programming Language

## About

Project "Programming Language" is simple artificial programming language, which
I call "Glo", which is build on JavaScript.

## About

Because of this is "programming" language our environment acts as follows. At
first "Loader" loads "Source" file, which is located in the root of project
(plain text file "program"). Than "Loader" tries to "run" source file. To do
this we should at first to parse source strings. To do this there are "Parser",
which is used for receiving an complex Object, which consists from calling
functions and their arguments. After "Parser" we call an "Evaluator", an part of
language, which decide what kind of function is called - this is some kind of
value, or this is keyword. Than we call an "Environment" to "run" our sources.

## Sample code
    do(define(x, 3),
    print(x))

## Keywords
* *if* - condition construction
* *while* - loop construction
* *do* - main body of program, which points what program must to do
* *define* - defining of variable with name and value
* *set* - defining new value of variable
* *fun* - Function construction

## Operators
* *true* - logical (boolean) true
* *false* - logical (boolean) false
* *'+'*, *'-'*, *'x'*, *'/'*, *'=='*, *'<'*, *'>'* - simple arithmetical operators, return
a result of corresponding arithmetical function
* *plus* - the same as '+', returns a result of adding one number to another
* *minus* - the same as '-', returns a result of subtraction of one number from another
* *multiply* - the same as '*', returns the result of multiplying of one number by another
* *divide* - the same as '/', returns the result of dividing of first number by second one
* *compare* - the same as '==', returns 'true' or 'false' if comparing data are equal or not
* *less* - the same as '<', returns 'true' if first number is less than second, otherwise returns 'false'
* *print* - prints argument to console
* *module* - returns absolute value of number (unsigned number)
* *random* - returns random number between min and max number
* *array* - returns new array of data
* *length* - returns 'length' of specified array
* *element* - returns corresponding element in specified cell of specified array


## Program structure
Program source -> Loader -> Parser -> Evaluator -> Runtime