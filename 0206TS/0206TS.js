//nterfaces are extensible (you can add more fields to them later by declaring them again), whereas Types are not.
//2.Unions (|)
//Unions allow a variable to be more than one type. This is vital for Error Handling where a function might return a Data object OR an Error object.
var apiStatus;
apiStatus = "success";
apiStatus = 404;
var userResponse = {
    data: { id: 1, name: "Vishal", email: "v@test.com" },
    status: 200,
    message: "User fetched successfully",
};
