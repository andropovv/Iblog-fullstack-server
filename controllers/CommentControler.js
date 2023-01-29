import CommentModel from "../models/comment.js";
import PostModel from "../models/Post.js";

export const getForPost = async (req, res) => {
  const postId = req.params.id;

  try {
    const comments = await CommentModel.find({ postId: postId })
      .populate("user")
      .exec();

    res.json(comments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Ошибка получения постов", error });
  }
};

export const remove = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const postId = req.params.id;

    CommentModel.findOneAndDelete(
      {
        _id: commentId,
      },
      (err, doc) => {
        if (err) {
          console.log(error);
          res.status(500).json({ message: "Ошибка удаления", error });
        }
        if (!doc) {
          return res.status(404).json({ message: "Комментарий не найден" });
        }
      }
    );
    PostModel.findByIdAndUpdate(
      {
        _id: postId,
      },
      { $inc: { commentsCount: -1 } },
      (err, doc) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Ошибка получения статьи", err });
        }
        if (!doc) {
          return res.status(404).json({ message: "Статья не найдена" });
        }
      }
    );
    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Ошибка удаления", error });
  }
};

export const create = async (req, res) => {
  const postId = req.params.id;

  try {
    PostModel.findByIdAndUpdate(
      {
        _id: postId,
      },
      { $inc: { commentsCount: 1 } },
      (err, doc) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Ошибка получения статьи", err });
        }
        if (!doc) {
          return res.status(404).json({ message: "Статья не найдена" });
        }
      }
    );

    const doc = new CommentModel({
      text: req.body.text,
      postId,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Не удалось создать комментарий", error });
  }
};
