const Admin= require("../models/adminModel.js")







exports.addAdmin = async (adminProfile)=>{
  console.log(adminProfile);
    try {
        var admin= await Admin.create(adminProfile)
        return admin
    } catch (error) {
        return new Error(error.message)
    }
}

exports.fetchAdmin = async (adminId) => {
    try {
      var admin = await Admin.findOne({ userId: adminId });
      return admin;
    } catch (error) {
      return new Error(error.message);
    }
  };