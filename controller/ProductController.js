const { Product } = require("../models/Product");

exports.createProduct = async (req, res) => {
    // this product we have to get from API body
    const product = new Product(req.body);
    product.discountPrice = Math.round(product.price*(1-product.discountPercentage/100))
    try {
      const doc = await product.save();
      res.status(201).json(doc);
    } catch (err) {
      res.status(400).json(err);
    }
  };

  exports.fetchAllProducts = async (req,res) =>{
    let query= Product.find({});
    if (req.query.category) {
        query = query.find({ category: req.query.category});
    }
    if(req.query.brand){
        query = query.find({brand: req.query.brand})
    }
    if(req.query._sort && req.query._order){
        query = query.sort({[req.query._sort]:req.query._order})
    }
    if(req.query._page && req.query._limit){
        const pageSize=req.query._limit;
        const page=req.query._page;
        query=query.skip(pageSize*(page-1).limit(pageSize));
    }

    try{
        const docs = await query.exec();
        res.status(201).json(docs);
    }catch(e){
        res.status(400).json(err);
    }

  }

  exports.fetchProductById= async (req,res) => {
    const {id} = req.params;
    try{
        const product = await Product.findById(id);
        res.status(201).json(product);
    }catch(e){
        res.status(400).json(e)
    }
  }

  exports.updateProduct = async (req,res) => {
    const {id} = req.params;
    try{
        const updProduct  = await Product.findByIdAndUpdate(id,req.body,{new:true})
        res.status(201).json(updProduct)
    }catch(e){
        res.status(400).json(e)
    }
  }