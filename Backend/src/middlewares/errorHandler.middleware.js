const errorHandler = (err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        success: err.success || false,
        message: err.message,
        errors: err.errors || [],
        stack: process.env.NODE_ENV === "development"
            ? err.stack
            : undefined
    })
}

export { errorHandler }