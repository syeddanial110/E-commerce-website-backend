const {Schema, model} =require("mongoose")


const reviewsSchema= new Schema(
    {
        description: String

    },
    {
        timestamps:true
    }
)

const review=new model("review", reviewsSchema)

module.exports = review