"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const uuid_1 = require("uuid");
const is_auth_1 = require("./middleware/is-auth");
const post_1 = require("./entities/post");
const user_1 = require("./entities/user");
const router = (0, express_1.Router)();
const uploadDir = path_1.default.join(__dirname, "../uploads");
(async () => {
    try {
        await promises_1.default.mkdir(uploadDir, { recursive: true });
    }
    catch (err) {
        console.error("Error creating uploads directory:", err);
    }
})();
const storage = multer_1.default.diskStorage({
    destination: async (req, file, cb) => {
        try {
            cb(null, uploadDir);
        }
        catch (err) {
            cb(err, uploadDir);
        }
    },
    filename: (req, file, cb) => {
        const uniqueName = `${(0, uuid_1.v4)()}${path_1.default.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    }
    else {
        cb(new Error("Only image files are allowed"));
    }
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 25 * 1024 * 1024 },
});
router.post("/post", is_auth_1.expressIsAuth, upload.array("files", 4), async (req, res) => {
    try {
        if (!req.files) {
            return res.status(400).json({ message: "No files uploaded" });
        }
        const filePaths = req.files.map((file) => path_1.default.join("uploads/", file.filename));
        const post = await post_1.Post.create({
            body: req.body.body,
            creatorId: req.session.userId,
            attachments: filePaths,
        }).save();
        return res.status(200).json(post);
    }
    catch (error) {
        console.error("Error creating post:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
router.post("/update", is_auth_1.expressIsAuth, upload.array("files", 4), async (req, res) => {
    try {
        if (!req.files) {
            return res.status(400).json({ message: "No files uploaded" });
        }
        const filePaths = req.files.map((file) => path_1.default.join("uploads/", file.filename));
        const post = await post_1.Post.update({ id: req.body.postId, creatorId: req.session.userId }, {
            body: req.body.body,
            attachments: filePaths,
        });
        return res.status(200).json(post);
    }
    catch (error) {
        console.error("Error updating post:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
router.post("/avatar", is_auth_1.expressIsAuth, upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const user = await user_1.User.update({ id: req.session.userId }, { avatar: path_1.default.join("uploads/", req.file.filename) });
        return res.status(200).json(user);
    }
    catch (error) {
        console.error("Error updating avatar:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.default = router;
//# sourceMappingURL=upload.js.map