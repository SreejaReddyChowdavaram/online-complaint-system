import formidable from "formidable";
import fs from "fs";
import path from "path";

/**
 * Parses a multipart/form-data request in a serverless function.
 * @param {import('next').NextApiRequest} req 
 * @returns {Promise<{fields: any, files: any}>}
 */
export const parseMultipartForm = (req) => {
  const form = formidable({
    multiples: true,
    keepExtensions: true,
    // Note: On Vercel, we can't save to /uploads permanently.
    // We can save to /tmp temporarily.
    uploadDir: "/tmp", 
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      
      // Formidable 2.x/3.x returns fields as arrays sometimes. Normalize them.
      const normalizedFields = {};
      for (const key in fields) {
        normalizedFields[key] = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
      }

      resolve({ fields: normalizedFields, files });
    });
  });
};
