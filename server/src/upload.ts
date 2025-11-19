import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import { expressIsAuth } from "./middleware/is-auth";
import { Post } from "./entities/post";
import { User } from "./entities/user";

const router = Router();

// --- Setup Upload Directory ---
const uploadDir = path.join(__dirname, "../uploads");

// Ensure upload directory exists before handling uploads
(async () => {
    try {
        await fs.mkdir(uploadDir, { recursive: true });
    } catch (err) {
        console.error("Error creating uploads directory:", err);
    }
})();

// --- Configure Multer Storage ---
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            cb(null, uploadDir);
        } catch (err) {
            cb(err as Error, uploadDir);
        }
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

// --- File Filter (images only) ---
const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"));
    }
};

// --- Initialize Multer ---
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB limit
});

// --- Routes ---

// Create Post
router.post(
    "/post",
    expressIsAuth,
    upload.array("files", 4) as any,
    async (req, res) => {
        try {
            if (!req.files) {
                return res.status(400).json({ message: "No files uploaded" });
            }

            const filePaths = (req.files as Express.Multer.File[]).map((file) =>
                path.join("uploads/", file.filename)
            );

            const post = await Post.create({
                body: req.body.body,
                creatorId: req.session.userId,
                attachments: filePaths,
            }).save();

            return res.status(200).json(post);
        } catch (error) {
            console.error("Error creating post:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
);

// Update Post
router.post(
    "/update",
    expressIsAuth,
    upload.array("files", 4) as any,
    async (req, res) => {
        try {
            if (!req.files) {
                return res.status(400).json({ message: "No files uploaded" });
            }

            const filePaths = (req.files as Express.Multer.File[]).map((file) =>
                path.join("uploads/", file.filename)
            );

            const post = await Post.update(
                { id: req.body.postId, creatorId: req.session.userId },
                {
                    body: req.body.body,
                    attachments: filePaths,
                }
            );

            return res.status(200).json(post);
        } catch (error) {
            console.error("Error updating post:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
);

// Update User Background
// router.post("/bg", expressIsAuth, upload.single("file"), async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ message: "No file uploaded" });
//         }

//         const user = await User.update(
//             { id: req.session.userId },
//             { bg: path.join("uploads/", req.file.filename) }
//         );

//         return res.status(200).json(user);
//     } catch (error) {
//         console.error("Error updating background:", error);
//         return res.status(500).json({ error: "Internal server error" });
//     }
// });

// Update User Avatar
router.post(
    "/avatar",
    expressIsAuth,
    upload.single("file") as any,
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "No file uploaded" });
            }

            const user = await User.update(
                { id: req.session.userId },
                { avatar: path.join("uploads/", req.file.filename) }
            );

            return res.status(200).json(user);
        } catch (error) {
            console.error("Error updating avatar:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
);

export default router;
