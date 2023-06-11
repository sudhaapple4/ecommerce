const { User } = require("../models/User");
 

exports.fetchUserById = async (req,res) => {
    const {id}=req.params;
    try{
        const user = await User.findById(id);
        res.status(201).json({id:user.id,addresses:user.addresses,email:user.email,role:user.role})
    }catch(e){
        res.status(400).json(e)
    }
}

exports.updateUser = async (req,res) => {
    const {id} = req.params;
    try{
        const user = User.findByIdAndUpdate(id,req.body, {new:true});
        res.status(201).json(user)
    }catch(e){
        res.status(400).json(e)
    }
}