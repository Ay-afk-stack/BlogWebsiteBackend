require("dotenv").config();

//Importing Express framework
const express = require("express");
const connectToDatabase = require("./database");
const app = express();

//Enable to Read JSON
app.use(express.json());

//Importing Middleware
const { multer, storage } = require("./middleware/multerConfig");
const upload = new multer({ storage: storage });

//Importing FS
const fs = require("fs");

//Database Connection
connectToDatabase();

//Importing Model
const Blog = require("./model/blogModel");

//Insert API
app.post("/blog", upload.single("image"), async (req, res) => {
  const { title, subTitle, description } = req.body;
  const { filename } = req.file;

  if (!title || !subTitle || !description || !filename) {
    fs.unlink(`./storage/${filename}`, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully Unlink!");
      }
    });

    return res.status(400).json({ message: "Enter all Details" });
  }

  await Blog.create({
    title: title,
    subTitle: subTitle,
    description: description,
    image: filename,
  });

  res.status(200).json({
    message: "Blog Inserted successfully!",
  });
});

//Get All API
app.get("/blog", async (req, res) => {
  const blogs = await Blog.find();

  if (blogs.length === 0)
    return res.status(404).json({ message: "No Blog Found!" });

  res.status(200).json({
    message: "Blogs fetched Successfully!",
    data: blogs,
  });
});

//Get API
app.get("/blog/:id", async (req, res) => {
  const id = req.params.id;
  const blog = await Blog.findById(id);

  if (!blog)
    return res.status(404).json({ message: "No Blog Found with that id" });

  res.status(200).json({
    message: "Blog Fetched Successfully!",
    data: blog,
  });
});

//Delete API
app.delete("/blog/:id", async (req, res) => {
  const id = req.params.id;
  const blog = await Blog.findById(id);

  if (!blog)
    return res.status(404).json({ message: "No Blog Found with that id" });

  fs.unlink(`./storage/${blog.image}`, (err) => {
    if (err) console.log(err);
  });

  await Blog.findByIdAndDelete(id);

  res.status(200).json({
    message: "Blog Deleted Successfully!",
  });
});

//Update API
app.patch("/blog/:id", upload.single("image"), async (req, res) => {
  const id = req.params.id;
  const { title, subTitle, description } = req.body;
  const { filename } = req.file;

  if (filename) {
    const { image } = await Blog.findById(id);
    const toDeleteImage = image;
    fs.unlink(`./storage/${toDeleteImage}`, (err) => {
      if (err) console.log(err);
    });
  }

  const upDatedBlog = { title, subTitle, description, image: filename };

  await Blog.findByIdAndUpdate(id, upDatedBlog);

  res.status(200).json({
    message: "Blog Updated Successfully!",
  });
});

//Enabling Access to Storage
app.use(express.static("./storage"));

//Listening to PORT
app.listen(process.env.PORT, () => {
  console.log("NodeJs Project Started.");
});
