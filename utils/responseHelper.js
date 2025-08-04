exports.successResponse = (res, message, data = {}) => {

    if (res.headersSent) return;
    
    res.status(200).json({ status: "1", message, data });
};

exports.errorResponse = (res, message, statusCode = 500, error = "") => {

    if (res.headersSent) return; 

    const response = { status: 0, message };
    if (error) response.error = error;
    
    res.status(statusCode).json({ status: "0", message, error });
};
