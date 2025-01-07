export function errorHandler(err, req, res, next) {
    console.error(err);
    
    res.status(500).json({
      error: {
        message: "An unexpected error occurred",
        code: "INTERNAL_SERVER_ERROR"
      }
    });
  }