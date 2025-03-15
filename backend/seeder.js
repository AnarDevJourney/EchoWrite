import BlogPost from "./models/blogPostModel.js";
import Comment from "./models/commentModel.js";
import Like from "./models/likeModel.js";
import Notification from "./models/notificationModel.js";
import User from "./models/userModel.js";
import blogPosts from "./data/blogPosts.js";
import users from "./data/users.js";
import connectDB from "./config/db.js";
import colors from "colors";
import dotenv from "dotenv";
dotenv.config();

connectDB();

const importData = async () => {
  try {
    await BlogPost.deleteMany();
    await Comment.deleteMany();
    await Like.deleteMany();
    await Notification.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;
    const sampleBlogPosts = blogPosts.map((blogPost) => {
      return { ...blogPost, author: adminUser };
    });
    await BlogPost.insertMany(sampleBlogPosts);

    console.log("Data Imported!".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await BlogPost.deleteMany();
    await Comment.deleteMany();
    await Like.deleteMany();
    await Notification.deleteMany();
    await User.deleteMany();

    console.log("Data destroyed!".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
