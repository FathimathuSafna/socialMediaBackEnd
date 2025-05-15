import mongoose from "mongoose";

var Schema = mongoose.Schema
var postSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    location: {
        type: String,
    },
    postImageUrl: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    isArchived:{
        type: Boolean,
        default:false
    },
    status:{
        type:Boolean,
        default:true
    }
})


const Post = mongoose.model("Post", postSchema)
export default Post