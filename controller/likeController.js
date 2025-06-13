import Likes from '../modals/likesSchema.js';

const likePost = async (req, res) => {
    console.log(req.body);
    const {userId, postId} = req.body;
    
    try {
        // Check if the like already exists
        const existingLike = await Likes.findOne({ 
            userId:userId, 
            postId: postId
        });
        if (existingLike) {
            // If it exists, remove the like
            await Likes.deleteOne({ userId, postId });
            return res.status(200).json({
                status: true,
                message: "Like removed successfully",
            });
        }
        // If it doesn't exist, create a new like
        const newLike = await Likes.create({ userId, postId }); 
        res.status(201).json({
            status: true,
            message: "Post liked successfully",
            data: newLike,
        });
    }
    catch (error) {
        res.status(400).json({
            status: false,
            message: "Error liking post",
            error: error.message,
        });
    }   
}
export { likePost };