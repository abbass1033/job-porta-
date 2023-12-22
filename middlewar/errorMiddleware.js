

//error middleware || NEXT function

const errorMiddleware = (err , req , res , next)=>{
    console.log(err);
    res.status(400).send({
        success : false , message : "something went wrong " , 
    });
}

module.exports = errorMiddleware;
