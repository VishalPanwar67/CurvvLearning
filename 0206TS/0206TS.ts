//1.Types vs. Interfaces
// Use Interface for the structure of an object
interface User {
  readonly id: number;
  name: string;
  email: string;
}

// Use Type for Union of specific values
type UserRole = "admin" | "user" | "guest";

// Combining them
interface AppUser extends User {
  role: UserRole;
}
//nterfaces are extensible (you can add more fields to them later by declaring them again), whereas Types are not.

//2.Unions (|)
//Unions allow a variable to be more than one type. This is vital for Error Handling where a function might return a Data object OR an Error object.
let apiStatus: "success" | "error" | 404 | 500;

apiStatus = "success";
apiStatus = 404;
//apiStatus = "pending"; // Error: Type '"pending"' is not assignable to type

//3. Generics (<T>) Generics are like "variables for types."

interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  error?: string;
}

const userResponse: ApiResponse<User> = {
  data: { id: 1, name: "Vishal", email: "v@test.com" },
  status: 200,
  message: "User fetched successfully",
};

export {};
