/**
 * Formats the given size in bytes into a human-readable format.
 * @param bytes - The size in bytes to be formatted.
 * @returns A string representing the formatted size.
 */
export const formatBytes = (bytes: number): string => {
  // Ensure positive value for consistent formatting
  const bytesAbs = Math.abs(bytes);

  if (bytesAbs < 1024) {
    // Format size in bytes
    return `${bytes} bytes`;
  } else if (bytesAbs < 1048576) {
    // Format size in kilobytes
    return `${(bytes / 1024).toFixed(2)} KB`;
  } else if (bytesAbs < 1073741824) {
    // Format size in megabytes
    return `${(bytes / 1048576).toFixed(2)} MB`;
  }

  // Format size in gigabytes
  return `${(bytes / 1073741824).toFixed(2)} GB`;
};
