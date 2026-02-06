//TypeScript is smart. If you use an if statement to check a type, TypeScript "narrows" the type inside that block.
//Task : Write a function that handles a "Trace ID" which could be a string or a number.

function processTraceId(id: string | number) {
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  } else {
    console.log(id.toFixed(2));
  }
}

processTraceId("abc123"); // Output: ABC123
processTraceId(456.789); // Output: 456.79

//2. Truthiness & Equality Narrowing : Sometimes you need to check if a value exists before using it

function logMetadata(data?: object) {
  if (data) {
    console.log(Object.keys(data));
  } else {
    console.log("No metadata provided.");
  }
}

logMetadata({ author: "Vishal", version: "1.0" }); // Output: [ 'author', 'version' ]
logMetadata(); // Output: No metadata provided.

//3. Custom Type Guards : You can create your own functions to check for specific types.

interface UserError {
  code: string;
  message: string;
}

function isUserError(error: any): error is UserError {
  return (error as UserError).code !== undefined;
}

function handleError(error: UserError | Error) {
  if (isUserError(error)) {
    console.log(`User Error: ${error.code} - ${error.message}`);
  } else {
    console.log(`General Error: ${error.message}`);
  }
}

handleError({ code: "USER_NOT_FOUND", message: "User does not exist." }); // Output: User Error: USER_NOT_FOUND - User does not exist.
handleError(new Error("Something went wrong.")); // Output: General Error: Something went wrong.

export {};
