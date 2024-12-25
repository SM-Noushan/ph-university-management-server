import fs from "fs";
import multer from "multer";
import config from "../config";
import status from "http-status";
import AppError from "../errors/AppError";
import { v2 as cloudinary } from "cloudinary";

// Configuration
cloudinary.config({
  cloud_name: config.cloudinaryCloudName as string,
  api_key: config.cloudinaryApiKey as string,
  api_secret: config.cloudinaryApiSecret as string,
});

export const sendImageToCloudinary = async (
  imageName: string,
  path: string,
) => {
  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(path, {
      public_id: imageName,
    })
    .catch(error => {
      throw new AppError(
        error.status || status.BAD_REQUEST,
        error.message || "Failed to upload image",
      );
    });

  // delete image from local storage
  fs.unlink(path, err => {
    if (err) throw err;
  });

  return uploadResult.secure_url;
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + "/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});
export const upload = multer({ storage: storage });
