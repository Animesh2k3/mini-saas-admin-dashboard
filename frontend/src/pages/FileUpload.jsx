import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const FileUpload = () => {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setPreview(URL.createObjectURL(file));
    uploadFile(file);
  }, []);

  const uploadFile = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    await api.post("/files/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("File uploaded successfully");
    setLoading(false);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "application/pdf": [],
    },
  });

  return (
    <>
      <Navbar />
      <div className="p-6">
        <div
          {...getRootProps()}
          className="border-2 border-dashed p-10 text-center cursor-pointer"
        >
          <input {...getInputProps()} />
          <p>Drag & drop file here, or click to upload</p>
        </div>

        {preview && (
          <img src={preview} alt="preview" className="mt-4 w-40" />
        )}

        {loading && <p>Uploading...</p>}
      </div>
    </>
  );
};

export default FileUpload;
