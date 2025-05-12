import mongoose from "mongoose";

var Schema = mongoose.Schema
var followersSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    followedUserId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true   // userId olla users inn edkukka
    }
})

const followerDetails = mongoose.model("followerDetails",followersSchema)
export default followerDetails