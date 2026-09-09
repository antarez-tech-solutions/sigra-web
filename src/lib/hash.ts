/** SHA-256 of a File, lowercase hex — matches the backend's
 *  hash_document output format exactly. */
export async function sha256HexOfFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const digest = await crypto.subtle.digest('SHA-256', buffer)
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export const SHA256_HEX_RE = /^[0-9a-f]{64}$/
