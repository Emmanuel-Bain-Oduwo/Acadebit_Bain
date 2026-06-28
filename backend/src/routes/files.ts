import { Router, Response, Request } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { authenticate, AuthRequest } from "../middleware/auth";
import pool from "../config/db";

const router = Router();

const uploadDir = process.env.UPLOAD_DIR || "./uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/jpeg", "image/png", "image/gif", "image/webp",
  "video/mp4", "video/webm",
  "audio/mpeg", "audio/mp4", "audio/wav",
  "text/plain", "text/csv",
];

const upload = multer({
  storage,
  limits: { fileSize: Number(process.env.MAX_FILE_SIZE_MB || 500) * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`));
    }
  },
});

router.use(authenticate);

// POST /api/files/upload — upload a file
router.post("/upload", upload.single("file"), async (req: AuthRequest & Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: "No file provided" });
    return;
  }

  const { originalname, filename, mimetype, size } = req.file;
  const filePath = `/uploads/${filename}`;

  try {
    const result = await pool.query(
      `INSERT INTO file_uploads (school_id, uploaded_by, filename, original_name, mime_type, size_bytes, file_path)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [req.user!.schoolId, req.user!.id, filename, originalname, mimetype, size, filePath]
    );

    res.status(201).json({
      id: result.rows[0].id,
      filename,
      originalName: originalname,
      mimeType: mimetype,
      sizeBytes: size,
      url: filePath,
      createdAt: result.rows[0].created_at,
    });
  } catch (err) {
    // Clean up uploaded file on DB error
    fs.unlink(path.join(uploadDir, filename), () => {});
    console.error("File upload DB error:", err);
    res.status(500).json({ error: "Failed to save file record" });
  }
});

// POST /api/files/upload-multiple — upload up to 10 files
router.post("/upload-multiple", upload.array("files", 10), async (req: AuthRequest & Request, res: Response): Promise<void> => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    res.status(400).json({ error: "No files provided" });
    return;
  }

  try {
    const uploaded = [];
    for (const file of files) {
      const filePath = `/uploads/${file.filename}`;
      const result = await pool.query(
        `INSERT INTO file_uploads (school_id, uploaded_by, filename, original_name, mime_type, size_bytes, file_path)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, file_path, created_at`,
        [req.user!.schoolId, req.user!.id, file.filename, file.originalname, file.mimetype, file.size, filePath]
      );
      uploaded.push({
        id: result.rows[0].id,
        filename: file.filename,
        originalName: file.originalname,
        url: filePath,
      });
    }
    res.status(201).json({ files: uploaded });
  } catch (err) {
    res.status(500).json({ error: "Failed to upload files" });
  }
});

// GET /api/files — list uploaded files for school
router.get("/", async (req: AuthRequest, res: Response): Promise<void> => {
  const schoolId = req.user!.schoolId;
  const { mimeType, limit = 50, offset = 0 } = req.query as Record<string, string>;

  try {
    let query = `SELECT fu.*, u.name as uploaded_by_name FROM file_uploads fu
                 JOIN users u ON u.id = fu.uploaded_by WHERE fu.school_id = $1`;
    const params: (string | number)[] = [schoolId];

    if (mimeType) { params.push(`${mimeType}%`); query += ` AND fu.mime_type ILIKE $${params.length}`; }
    query += ` ORDER BY fu.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(Number(limit), Number(offset));

    const result = await pool.query(query, params);
    res.json({ files: result.rows });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch files" });
  }
});

// DELETE /api/files/:id
router.delete("/:id", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const file = await pool.query(
      `SELECT * FROM file_uploads WHERE id = $1 AND uploaded_by = $2`,
      [req.params.id, req.user!.id]
    );
    if (!file.rows[0]) { res.status(404).json({ error: "File not found or not authorized" }); return; }

    const filePath = path.join(uploadDir, file.rows[0].filename);
    fs.unlink(filePath, (unlinkErr) => {
      if (unlinkErr) console.error("File delete error:", unlinkErr);
    });

    await pool.query(`DELETE FROM file_uploads WHERE id = $1`, [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete file" });
  }
});

export default router;
