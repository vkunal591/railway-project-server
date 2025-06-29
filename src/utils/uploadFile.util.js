import { session } from "#middlewares/session";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** NOTE: This function will be used only by mongoose model.
 * 	  This has to be defined as a pre hook in mongoose models where you want to handle image upload automatically
 * 	  If you want to upload manually then there is no need to call this one
 * @example
 * someMongooseSchema.pre("save",uploadFile)
 */

export async function saveFile(next) {
  try {
    const files = session.get("files");
    if (!files || !files.length) return next();

    const modelName = this.constructor.modelName;
    const documentId = this._id.toString();
    const uploadsDir = path.join(
      __dirname,
      "../uploads",
      modelName?.toLowerCase() || "",
      documentId.toLowerCase(),
    );

    await fs.mkdir(uploadsDir, { recursive: true });

    const paths = {};
    const modelKeys = this.constructor.schema.tree;

    const fileObj = {};
    for (let i of files) {
      fileObj[i.fieldname] = i;
    }

    for (const i in modelKeys) {
      if (modelKeys[i].multiFile) {
        const fileKey = modelKeys[i].fileKey;
        const data = this[i];
        for (const index in data) {
          if (fileKey + index in fileObj) {
            const file = fileObj[fileKey + index];
            const fieldName = file.fieldname;
            const ext = path.extname(file.originalname).toLowerCase();
            const newFileName = `${fieldName}${ext}`;
            const filePath = path.join(uploadsDir, newFileName);
            if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
              // Process image with sharp
              await sharp(file.buffer)
                .resize(800)
                .jpeg({ quality: 70 })
                .toFile(filePath);
            } else if ([".mp4", ".mov", ".avi", ".mkv"].includes(ext)) {
              // Directly write video file without processing
              await fs.writeFile(filePath, file.buffer);
            } else {
              continue; // Skip unsupported file types
            }
            data[index][fileKey] =
              filePath.split("/src")[1] ?? filePath.split("\\src")[1];
          }
        }
      }
    }

    for (const file of files) {
      const fieldName = file.fieldname;
      const ext = path.extname(file.originalname).toLowerCase();
      const newFileName = `${fieldName}${ext}`;
      const filePath = path.join(uploadsDir, newFileName);

      // Check if the field is a file field
      if (modelKeys[fieldName]?.file) {
        if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
          // Process image with sharp
          await sharp(file.buffer)
            .resize(800)
            .jpeg({ quality: 70 })
            .toFile(filePath);
        } else if ([".mp4", ".mov", ".avi", ".mkv"].includes(ext)) {
          // Directly write video file without processing
          await fs.writeFile(filePath, file.buffer);
        } else {
          continue; // Skip unsupported file types
        }

        // Store file path relative to the project root
        paths[fieldName] =
          filePath.split("/src")[1] ?? filePath.split("\\src")[1];
      }
    }

    Object.assign(this, paths);
    next();
  } catch (error) {
    next({
      status: false,
      message: "Failed to save files",
      httpStatus: 500,
      error: error.message,
    });
  }
}
