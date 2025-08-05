const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger definition
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "My API",
            version: "1.0.0",
            description: "API documentation for my Node.js app",
        },
        servers: [{
            url: "http://localhost:3000",
            description: "Local server",
        }, ],
    },
    // Paths to files where Swagger comments exist
    apis: ["routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

// Function to setup Swagger
const setupSwagger = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log("📄 Swagger docs available at: http://localhost:3000/api-docs");
};

module.exports = setupSwagger;