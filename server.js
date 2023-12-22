const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc =  require('swagger-jsdoc');

require("dotenv").config();

// Swagger api config
// swagger api options
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Job Portal Application",
      description: "Node Expressjs Job Portal Application",
    },
    servers: [
      {
        url: "http://localhost:8080"
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const spec = swaggerDoc(options);


const db = "mongodb+srv://abbasali:rr1234@cluster0.nfc0klb.mongodb.net/jobportal";
mongoose.connect(db);
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(morgan('dev'));
app.use(cors());


const errorMiddleWare = require('./middlewar/errorMiddleware');

app.use(errorMiddleWare);
const testRoutes = require('./routes/test_routes');
app.use("/api/v1/test", testRoutes);
const authRoutes = require('./routes/auth_routes');
app.use("/api/v1/auth", authRoutes);

const userRoutes = require('./routes/user_routes');
app.use("/api/v1/user", userRoutes);

const jobsRoutes = require('./routes/job_routes');
app.use("/api/v1/job", jobsRoutes);


//home-routes
app.use("/api-doc" , swaggerUi.serve , swaggerUi.setup(spec));
//port
const PORT = process.env.PORT || 8080;
//listen
app.listen(PORT, () => {
  console.log(`Node Server Running  on port no ${PORT}`);});