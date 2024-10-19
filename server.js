const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

require("./config/db");
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cookieParser = require('cookie-parser');
app.use('/uploads', express.static('uploads'));

app.use(cookieParser());

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

app.use("/api/v1",userRoutes)
app.use("/api/v1/product",productRoutes)
app.use("/api/v1/order",orderRoutes)

// swagger Ui
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: " Inventory and Order Management System",
    version: "1.0.0",
    description: "API for managing Inventory and Order Management System",
  },
  servers: [
    {
      url: "http://localhost:5000/api", // Replace with your API base URL
    },
  ],
};
// Options for Swagger JSDoc
const options = {
  swaggerDefinition,
  // Path to the API docs
  apis: [
    "./routes/userRoutes.js",
    "./routes/productRoutes.js",
    "./routes/orderRoutes.js",

  ],
};

// Initialize SwaggerJSDoc
const swaggerSpec = swaggerJsdoc(options);

// Use Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.get("/",(req,res)=>{
    res.send("<center><h1>Inventory and Order Management System</h1><br>Get Recipe Api <a href=https://github.com/Devanshiballar/Inventory_Order_Management_System.git target=_blank>Repository :Inventory and Order Management System</a></center>")
  })
  
  app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });