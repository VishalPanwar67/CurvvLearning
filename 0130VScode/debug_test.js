function calculateFactorial(n) {
  let result = 1;
  for (let i = 1; i <= n; i++) {
    result *= i; // want to inspect 'result' and 'i'
  }
  return result;
}

const number = 5;
const finalValue = calculateFactorial(number);
console.log(`Factorial of ${number} is: ${finalValue}`);
