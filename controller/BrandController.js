const {Brand} = require('../models/Brand');

exports.fetchBrands = async (req,res)=>{
    try{
       const brands = await Brand.find({});
       console.log('---brands ',brands)
      // res.status(201).json(brands);
      res.status(201).json(brands);
    }catch(e){
        res.status(400).json(e)
    }
}

exports.createBrand = async (req,res)=>{
    const brand = new Brand(req.body);
    try{
        const doc= await brand.save();
        console.log('doc ',doc)
        res.status(201).json(doc);
    }catch(e){
        res.status(400).json(e)
    }
}