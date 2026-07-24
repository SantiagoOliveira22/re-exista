import { mkdir, writeFile } from "fs/promises";
import path from "path";

const MAX_ICON_SIZE = 500 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  "image/svg+xml",
  "image/png",
  "image/jpeg",
  "image/webp",
]);

const ALLOWED_EXTENSIONS = new Set(["svg", "png", "jpg", "jpeg", "webp"]);

function getFileExtension(fileName: string): string {
  return fileName.split(".").pop()?.toLowerCase() || "";
}

function getMimeType(file: File, ext: string): string {
  if (file.type && ALLOWED_MIME_TYPES.has(file.type)) {
    return file.type;
  }

  const mimeByExtension: Record<string, string> = {
    svg: "image/svg+xml",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
  };

  return mimeByExtension[ext] ?? "application/octet-stream";
}

export function validateCategoryIconFile(file: File): void {
  if (file.size <= 0) {
    throw new Error("Arquivo de ícone inválido.");
  }

  if (file.size > MAX_ICON_SIZE) {
    throw new Error("Ícone muito grande. O limite é 500KB.");
  }

  const ext = getFileExtension(file.name);
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    throw new Error("Formato inválido. Use SVG, PNG, JPG ou WebP.");
  }

  if (file.type && !ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error("Formato inválido. Use SVG, PNG, JPG ou WebP.");
  }
}

async function saveIconToFilesystem(file: File, slug: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = getFileExtension(file.name) || "svg";
  const iconsDir = path.join(process.cwd(), "public", "icons");

  await mkdir(iconsDir, { recursive: true });

  const fileName = `${slug}-${Date.now()}.${ext}`;
  await writeFile(path.join(iconsDir, fileName), buffer);

  return `/icons/${fileName}`;
}

async function saveIconAsDataUrl(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = getFileExtension(file.name) || "png";
  const mime = getMimeType(file, ext);

  return `data:${mime};base64,${buffer.toString("base64")}`;
}

export async function saveCategoryIcon(
  file: File,
  slug: string,
): Promise<string> {
  validateCategoryIconFile(file);

  const isServerless = process.env.VERCEL === "1";

  if (!isServerless) {
    try {
      return await saveIconToFilesystem(file, slug);
    } catch (error) {
      console.warn(
        "[re-exista] Falha ao salvar ícone no disco, usando data URL.",
        error,
      );
    }
  }

  return saveIconAsDataUrl(file);
}
