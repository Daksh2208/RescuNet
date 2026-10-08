import cloudinary from "../../config/cloudinary.js";
import streamifier from "streamifier";
export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image is required",
            });
        }
        const file = req.file;
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({
                folder: "resqnet/incidents",
            }, (error, result) => {
                if (error)
                    return reject(error);
                resolve(result);
            });
            streamifier.createReadStream(file.buffer).pipe(stream);
        });
        return res.json({
            success: true,
            imageUrl: result.secure_url,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Upload failed",
        });
    }
};
//# sourceMappingURL=upload.controller.js.map