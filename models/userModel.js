const { Schema, model } = require("mongoose");
var bcrypt = require('bcryptjs');
const userSchema = new Schema(
  {
    userName: {
      type: String,
      //   required: true,
      //   message: 'hello username is required',
      required: [true, "username is required!"],
    },
    role: {
      type: String,
      required: [true, "Role is required!"],
      enum: ["admin", "buyer"], // in do fields ka ilawa hum is role ki field ma kuch enter nhi kar sakte enum hamain restrict karega
    },
    email: {
      type: String,
      unique: [true, "Email should be unique try with different email"], // indexing
      required: true, // todo check email pattern  // validation
      lower: true, // user@gmail.com & User@gmail.com // data modelling
    },
    displayPicture: {
      type: String,
      default: "default.png",
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      select: false, // is ki waja sa hum jitni bhi apis bana lainga hamain unka response ma password ki field nhi milagi because its crucial
      // minLength: [8, 'please enter 8 or greater digits password'],
    },
    passwordConfirm: {
      type: String,
      required: [true, "Confirm password is required!"],
      // custom validation
      // validate: {
      //   validator: function (passwordConfirmValue) {
      //     // we use here normal fucntion instead of arrow function just because we used here this keyword and in arrow function there is no worth of this keyword
      //     // this => document
      //     return passwordConfirmValue === this.password;
      //   },
      //   message: `password not match`,
      // },

      // OR

      validate: [
        function (passwordConfirmValue) {
          // console.log('passwordConfirmValue : ', passwordConfirmValue);
          // console.log('this.password : ', this.password);
          return passwordConfirmValue === this.password;
        },
        `password not match`,
      ],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.passwordVerification = async (password, hashPassword) => {
    return await bcrypt.compare(password, hashPassword);
  };
  userSchema.methods.passwordResetTokenGenerator = function () {
    //1- generate random string of 32 bits
    var resetToken = crypto.randomBytes(32).toString('hex');
  
    //2- encrypt reset token
    var encryptedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex'); // sha256 hashing algorithm
  
    //3- save encrypted reset token in user document
    // this =>user document or current document
    this.passwordResetToken = encryptedResetToken;
  
    //4- set token expiry (10 minute )
    this.passwordResetTokenExpiresAt = Date.now() + 10 * 60 * 1000;
  
    //5- return non encrypted reset token
    return resetToken;
  };
  
  userSchema.pre('save', async function (next) {
    if (!this.isModified('password') && !this.isNew) return next();
    // ya kaam hamai jwt sign hona sa pehla karwana hai or is ma kuch time lagege ga may be 5ms, 10ms to just security purpose hamne current time ma sa 1s minues karwa dia
    this.passwordChangedAt = Date.now() - 1000;
    next();
  });
  
  // hashing falling in cryptography not in networking
  userSchema.pre('save', async function (next) {
    // this indicates current document
    if (!this.isModified('password')) return next();
    var ancryptedPassword = await bcrypt.hash(this.password, 12); // number brute force attack
    this.password = ancryptedPassword;
    // if you want to remove any field in mongoose then we simply do in this way
    this.passwordConfirm = undefined; // dont show this complete field in DB
    // this.passwordConfirm = null; // return null in DB
    next();
  });
  



const User= new model("User", userSchema)

module.exports = User
