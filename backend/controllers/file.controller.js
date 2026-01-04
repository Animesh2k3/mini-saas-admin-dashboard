const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const pool = require("../config/db");

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "mini-saas-files" },
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
      `
      INSERT INTO files (user_id, file_name, file_url, file_type, file_size)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [
        req.user.id,
        req.file.originalname,
        result.secure_url,
        req.file.mimetype,
        req.file.size,
      ]
    );

    res.json({
      message: "File uploaded successfully",
      url: result.secure_url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "File upload failed" });
  }
};
