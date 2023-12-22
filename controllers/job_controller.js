const JobModel = require("../models/job_models");
const mongoose = require('mongoose');
const moment = require('moment');
const JobController = {
    createJob : async function(req , res){

        try{
        const jobData = req.body;
        const company = jobData.company;
         const position = jobData.position;
        if(!company  ){
            return res.json({success : false , message : "Please provide the company name"});
        }
        if(!position){
            return res.json({success : false ,  message : "Please provide the position"});
        }
         req.body.createdBy = req.user.userId;
       
       
        const createJob = await JobModel(jobData);
        await createJob.save();

        return res.json({success : true , data : createJob ,message : "Job created successfully"});

        }catch(ex){
            return res.status(401).json({success : false , message : ex});
        }
      
  
    },

    getJob : async function(req , res){
        try{
        const {status , workType , search , sort} = req.query;
        const queryObject = {
         createdBy: req.user.userId,
        };

        // //logic filter
        if(status && status !== "all"){
            queryObject.status = status;
        }

        if(workType && workType !== "all"){
            queryObject.workType = workType;
        }

        if(search){
            queryObject.position = {$regex : search , $options : "i"}
        }

      

        let querryResult = JobModel.find(queryObject);

        //sorting
         if (sort === "oldest") {
         querryResult = querryResult.sort("createdAt");
            }
             if (sort === "latest") {
             querryResult = querryResult.sort("createdAt");
            }

             if (sort === "a-z") {
             querryResult = querryResult.sort("position");
            }

                
             if (sort === "z-a") {
             querryResult = querryResult.sort("-position");
            }


             //pagination
             //pagination
             const page = Number(req.query.page) || 1;
             const limit = Number(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            querryResult = querryResult.skip(skip).limit(limit);
            console.log(querryResult);
            //jobs count
            const totalJobs = await JobModel.countDocuments(querryResult);
            console.log(querryResult);
            const numOfPage = Math.ceil(totalJobs / limit);

        
        const jobs = await querryResult;

        //const jobs = await JobModel.find({createdBy : req.user.userId});
        return res.status(200).json({success : true , data :jobs , totalJobs : jobs.length ,totaljob : totalJobs, pages : numOfPage});
        }
        catch(ex){
        return res.status(401).json({success : false , message: ex });
        }
      
    },

    updateJob :  async function(req , res , next){
        try{

             const {id} = req.params;
        const {company , position} = req.body;

        //validation
        if(!company || !position){
              return res.json({success : false , message : `Please provide all the fields` });
                   
        }

        //find job

        const job = await JobModel.findOne({_id : id});
        if(!job){
            return res.json({success : false , message : `no job found with this id ${id}` });
           
        }

        if(!req.user.userId ==  job.createdBy.toString()){
            res.json({success : false , message : `You are not Authorized for this job` });
            return;
             
        }

        const updateJob = await JobModel.findOneAndUpdate({_id : id} , req.body ,{
            new : true, 
            runValidators : true
        });

        //res

        return res.status(200).json({success : true , data :updateJob , message : "Successfully updated the job!"  });

        }
        catch(ex){
            return res.json({success : false , message : ex});
        }
    },

     deleteJob :  async function(req , res , next){
        try{

             const {id} = req.params;
       
        //find job

        const job = await JobModel.findOne({_id : id});
        if(!job){
            return res.json({success : false , message : `no job found with this id ${id}` });
           
        }

        if(!req.user.userId ==  job.createdBy.toString()){
            res.json({success : false , message : `You are not Authorized for this job` });
            return;
             
        }

        const deleteJob = await JobModel.findOneAndDelete({_id :id});

        //res

        return res.status(200).json({success : true , data :deleteJob , message : "Successfully deleted the job!"  });

        }
        catch(ex){
            return res.json({success : false , message : ex});
        }
    },

  // =======  JOBS STATS & FILTERS ===========
  jobStatus : async function(req , res){
    const status = await JobModel.aggregate([
     // search by user jobs
     {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
        $group : {
            _id : "$status",
            count : {$sum : 1}
        }
    }
    ]);

    const defaultStatus = {
        pending : status.pending || 0,
        reject : status.reject || 0,
        interview : status.interview || 0
    };

    let monthlyApplication = await JobModel.aggregate([
    {
        $match : {
            createdBy : new mongoose.Types.ObjectId(req.user.userId)
        }
    },
    {
        $group : {
            _id : {
                year : {$year : "$createdAt"},
                month: {$month : "$createdAt"}
            },
            count :{
            $sum : 1
            }
        }
    }
    ]);
    monthlyApplication = monthlyApplication
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();

    console.log(req.user.userId);
    return res.json({success : true , length :status.length , status :  defaultStatus , monthlyApplication : monthlyApplication});
  }
}

module.exports = JobController;