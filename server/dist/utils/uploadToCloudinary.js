"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = uploadToCloudinary;
const cloudinary_1 = __importDefault(require("@/config/cloudinary"));
async function uploadToCloudinary(fileBuffer, mimetype) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary_1.default.uploader.upload_stream({ folder: "products" }, (error, result) => {
            if (error)
                return reject(error);
            if (!result)
                return reject(new Error("No result from Cloudinary"));
            resolve({ secure_url: result.secure_url });
        });
        stream.end(fileBuffer);
    });
}
