const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const pool = require("../config/db");

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "avatars",
            transformation: [
              { width: 200, height: 200, crop: "fill" },
            ],
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await streamUpload();

    await pool.query(
      "UPDATE users SET avatar_url=$1 WHERE id=$2",
      [result.secure_url, req.user.id]
    );

    res.json({
      message: "Avatar uploaded successfully",
      avatar_url: result.secure_url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Avatar upload failed" });
  }
};
