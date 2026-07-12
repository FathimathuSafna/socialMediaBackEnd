import "dotenv/config";
import mongoose from "mongoose";
import { v2 as cloudinary } from 'cloudinary';
import User from "./modals/userSchema.js";
import Post from "./modals/postsSchema.js";
import Likes from "./modals/likesSchema.js";
import Comment from "./modals/commentsSchema.js";
import followerDetails from "./modals/followersSchema.js";
import Conversation from "./modals/messageSchema.js";

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'qubxw9f3',
  api_key: '641171666156894',
  api_secret: 'jjzD0F2IZuYITfvhsESy1vUz4I0'
});

async function run() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGOURI);
    console.log('Database connected!');

    // 1. Clear database
    console.log('Clearing old database records...');
    await User.deleteMany({});
    await Post.deleteMany({});
    await Likes.deleteMany({});
    await Comment.deleteMany({});
    await followerDetails.deleteMany({});
    await Conversation.deleteMany({});
    console.log('Database cleared!');

    // 2. Synchronize clock drift
    console.log('Fetching Google server time for Cloudinary timestamp...');
    const timeResponse = await fetch('https://www.google.com');
    const serverDate = new Date(timeResponse.headers.get('date'));
    const correctTimestamp = Math.floor(serverDate.getTime() / 1000);
    console.log('Using corrected timestamp:', correctTimestamp);

    // 3. Upload seed images to Cloudinary
    console.log('Uploading profile pictures to Cloudinary...');
    const profileUrls = [];
    const seedProfilePics = [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop'
    ];

    for (let i = 0; i < seedProfilePics.length; i++) {
      const result = await cloudinary.uploader.upload(seedProfilePics[i], {
        folder: 'profilepictures',
        timestamp: correctTimestamp
      });
      profileUrls.push(result.secure_url);
      console.log(`Uploaded profile pic ${i + 1}:`, result.secure_url);
    }

    console.log('Uploading post images to Cloudinary...');
    const postUrls = [];
    const seedPostImages = [
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop'
    ];

    for (let i = 0; i < seedPostImages.length; i++) {
      const result = await cloudinary.uploader.upload(seedPostImages[i], {
        folder: 'posts',
        timestamp: correctTimestamp
      });
      postUrls.push(result.secure_url);
      console.log(`Uploaded post image ${i + 1}:`, result.secure_url);
    }

    // 4. Create mock users
    console.log('Creating users...');
    const users = await User.create([
      {
        userName: 'sarah_jones',
        name: 'Sarah Jones',
        phoneNumber: 9876543210,
        email: 'sarah@example.com',
        password: 'password123',
        bio: 'Travel enthusiast, photographer, and tea lover.',
        profilePictureUrl: profileUrls[0],
        dob: new Date('1995-04-12'),
        isVerified: true
      },
      {
        userName: 'john_doe',
        name: 'John Doe',
        phoneNumber: 9876543211,
        email: 'john@example.com',
        password: 'password123',
        bio: 'Software engineer by day, guitar player by night.',
        profilePictureUrl: profileUrls[1],
        dob: new Date('1992-08-25'),
        isVerified: true
      },
      {
        userName: 'emily_smith',
        name: 'Emily Smith',
        phoneNumber: 9876543212,
        email: 'emily@example.com',
        password: 'password123',
        bio: 'Food blogger and recipe developer. Let\'s cook together!',
        profilePictureUrl: profileUrls[2],
        dob: new Date('1998-11-03'),
        isVerified: true
      }
    ]);
    console.log('Users created!');

    // 5. Create mock posts
    console.log('Creating posts...');
    await Post.create([
      {
        userId: users[0]._id,
        location: 'Yosemite National Park, CA',
        postImageUrl: postUrls[0],
        description: 'Breathtaking views at Yosemite. nature never fails to amaze me! 🌲🏔️',
        isArchived: false,
        status: true
      },
      {
        userId: users[1]._id,
        location: 'Zurich, Switzerland',
        postImageUrl: postUrls[1],
        description: 'Exploring the beauty of Zurich. The mountains and rivers are stunning.',
        isArchived: false,
        status: true
      },
      {
        userId: users[2]._id,
        location: 'Tokyo, Japan',
        postImageUrl: postUrls[2],
        description: 'An evening walk under the cherry blossoms in Tokyo. Magic in the air! 🌸',
        isArchived: false,
        status: true
      }
    ]);
    console.log('Posts created!');

    console.log('Database successfully seeded!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

run();
