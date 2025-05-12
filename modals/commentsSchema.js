import mongoose from 'mongoose';

var Schema = mongoose.Schema
var commentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    commentText: {
        type: String,
        required: true
    },
    isDeleted:{
        type:Boolean,
        required:true
    }
})

const Comment = mongoose.model("Comment", commentSchema)
export default Comment