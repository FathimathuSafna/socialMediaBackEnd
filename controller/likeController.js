import Likes from '../modals/likesSchema.js';

const likePost = async (req, res) => {
    console.log(req.body);
    const userid = req.user._id; // Assuming user ID is passed from middleware
    const { postId } = req.body;
    
    try {
        // Check if the like already exists
        const existingLike = await Likes.findOne({ 
            userId:userid, 
            postId: postId,
            status: true
        });
        if (existingLike) {
            // If it exists, remove the like
            await Likes.deleteOne({
                userId: userid, 
                postId:postId,
             });
            return res.status(200).json({
                status: false,
                message: "Like removed successfully",
            });
        }
        // If it doesn't exist, create a new like
        const newLike = await Likes.create({ 
            userId:userid,
             postId:postId,
            status: true
             }); 
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

const getLikeCount = async (req, res) => {
    const postId = req.params.id; // Assuming postId is passed as a URL parameter
    try {
        const likeCount = await Likes.countDocuments({ postId: postId });
        res.status(200).json({
            status: true,
            message: "Like count retrieved successfully",
            data: { likeCount },
        });
    } catch (error) {
        res.status(400).json({
            status: false,
            message: "Error retrieving like count",
            error: error.message,
        });
    }
} 

export { likePost,getLikeCount };