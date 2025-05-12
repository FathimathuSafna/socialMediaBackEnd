import mongoose from 'mongoose';

var Schema = mongoose.Schema
var likesSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true
    }
})

const Likes = mongoose.model("Likes", likesSchema)
export default Likes