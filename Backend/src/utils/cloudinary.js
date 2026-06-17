import { v2 as cloudinary } from "cloudinary"
import fs from "fs"


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const uploadOnCloudinary = async (source) => {
    try {
        if (!source) return null
        const response = await cloudinary.uploader.upload(source, {
            resource_type: "auto"
        })

        if (fs.existsSync(source))
            fs.unlinkSync(source)

        return response
    } catch (error) {

        console.error("Cloudinary Error:", error);

        if (source && fs.existsSync(source))
            fs.unlinkSync(source)

        return null
    }
}

export { uploadOnCloudinary }