const { User } = require("../models/User");

exports.createUser = async (req, res) => {
  const usr = new User(req.body);
  try {
    const doc = await usr.save();
    console.log("doc ", doc);
    res.status(201).json(doc);
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).exec();
    // const user = await User.find({})
    console.log(user,user.password.toString(),req.body.email)
    if (!user) {
      res.status(400).json({ message: "no such user exists" });
    } else if (user.password.toString() === req.body.password) {
      res.status(201).json({id:user.id,name:user.name,email:user.email,addresses:user.addresses});
    } else {
      res.status(400).json({ message: "Invalid User name / password" });
    }
  } catch (e) {
    res.status(400).json(e);
  }
};
