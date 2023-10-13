import multer from 'multer';
import path from "path";


// Define storage and file name settings
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/'); // Set the destination folder
    },
    filename: (req, file, cb) => {
        let ext = path.extname(file.originalname)
        // cb(null, file.filename + "" + Date.now() + path.extname(file.originalname))
        cb(null, file.originalname)
    }
});

// Create the Multer instance with the storage configuration
const upload = multer({ storage: storage }).single("profile");

export default upload;