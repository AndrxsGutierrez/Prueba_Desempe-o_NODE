/** Represents an expected API error with its HTTP status code. */
class AppError extends Error{
    constructor(
        public status: number,
        message: string
    ){
        super(message)
    }
}

export default AppError
