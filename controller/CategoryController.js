const { Category } = require("../models/Category");

exports.fetchCategory = async (req, res) => {
  try {
    const category = await Category.find({});
    res.status(201).json(category);
  } catch (e) {
    res.status(400).json(e);
  } 
};

exports.createCategory= async (req,res) => {
    const category= new Category(req.body);
    try{
        const doc = await category.save();
        res.status(201).json(doc);    
    }catch(e){
        res.status(400).json(e)
    }
}