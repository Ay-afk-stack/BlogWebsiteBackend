const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Creating Attributes for Schema
const blogSchema = new Schema({
  title: {
    type: String,
    unique: true,
  },
  subTitle: {
    type: String,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
});

//Creating Schema
const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
