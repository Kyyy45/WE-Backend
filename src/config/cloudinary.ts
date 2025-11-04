import { v2 as cloudinary } from "cloudinary";
import { getEnv } from "../utils/env";

cloudinary.config({
  cloudinary_url: getEnv("CLOUDINARY_URL"),
});

export default cloudinary;
