import type { VirtualFile } from "@/lib/generator"

export async function writeProjectZip(
  files: VirtualFile[],
  projectName: string,
  zipPath: string,
): Promise<void> {
  const archiver = (await import("archiver")).default
  const { createWriteStream } = await import("fs")

  return new Promise((resolve, reject) => {
    const output = createWriteStream(zipPath)
    const archive = archiver("zip", { zlib: { level: 6 } })

    output.on("close", resolve)
    output.on("error", reject)
    archive.on("error", reject)

    archive.pipe(output)

    for (const file of files) {
      archive.append(file.content, { name: `${projectName}/${file.path}` })
    }

    archive.finalize()
  })
}
