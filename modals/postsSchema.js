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
        required: true
    },
    postImageUrl: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    isArchived:{
        type: Boolean,
        required: true
    },
    status:{
        type:Boolean,
        required:true
    }
})


const Post = mongoose.model("Post", postSchema)
export default Post