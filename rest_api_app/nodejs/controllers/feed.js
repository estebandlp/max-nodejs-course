exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        title: "First Post",
        content: "Dummy data",
        imageUrl: "images/duck.jfif",
        creator: {
          name: "Tebuso",
        },
        createdAt: new Date()
      },
    ],
  });
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;

  // Create post in db

  res.status(201).json({
    posts: [
      {
        message: "Success!",
        post: {
          id: new Date().toISOString(),
          title: title,
          content: content,
        },
      },
    ],
  });
};
