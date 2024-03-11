export function generateInviteCode(schoolName: string) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // Alphanumeric characters
  const extensionLength = 6; // Length of the extension portion of the code

  // Convert school name to uppercase and remove spaces
  let code = schoolName.toUpperCase().replace(/\s/g, "");

  // Generate random extension
  for (let i = 0; i < extensionLength; i++) {
    code += characters[Math.floor(Math.random() * characters.length)];
  }

  return code;
}

export function getMonthAndYearAsString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  // return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return `${month}-${year}`;
}

// * BASE 64 FUNCTIONS

export async function toBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export async function convertFilesToBase64(files: any) {
  const filePathsPromises: any = [];
  files.forEach((file: any) => {
    filePathsPromises.push(toBase64(file));
  });
  const base64files = await Promise.all(filePathsPromises);
  // const mappedFiles = filePaths.map((base64File) => base64File);
  return base64files;
}
