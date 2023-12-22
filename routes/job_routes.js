const jobRoutes = require('express').Router();
const jobController = require('../controllers/job_controller');
const userAuth = require('../middlewar/auth_middleware');

// CREATE JOB || POST
jobRoutes.post("/create-job", userAuth ,jobController.createJob);
jobRoutes.get("/get-job", userAuth ,jobController.getJob);
jobRoutes.put("/update-job/:id", userAuth ,jobController.updateJob);
jobRoutes.delete("/delete-job/:id", userAuth ,jobController.deleteJob);

//job status filter || GET
jobRoutes.get("/job-status", userAuth ,jobController.jobStatus);

module.exports = jobRoutes;