import multer from "multer";

/** Keeps uploaded JSON files in memory while the import is processed. */
export const uploadJson = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024
  }
});
