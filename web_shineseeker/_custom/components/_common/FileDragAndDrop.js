"use client";
import {useState, useRef} from "react";

export default function FileUpload(props) {
  const css = props?.css || "";
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState(null);
  const dropzoneRef = useRef(null);
  const inputRef = useRef(null);

  const updateInputFiles = (files) => {
    console.log("updateInputFiles : ", files);
    inputRef.current.files = files;
  };

  const handleDrop = (event) => {
    event.preventDefault();
    updateInputFiles(event.dataTransfer.files);
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles(droppedFiles);

    const file = droppedFiles[0];
    console.log("handleDrop !", file);
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleDragOver = (event) => {
    console.log("handleDragOver !");
    event.preventDefault();
  };

  const handleInputChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);

    const file = selectedFiles[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("handleInputChange !");
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Form data submission logic
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file);
    });
    console.log(files, formData);
    fetch("/api/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className={css + " file-upload"}>
      <div
        ref={dropzoneRef}
        className="dropzone rounded-md border-gray-300 border bg-white p-2 flex justify-center items-center"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => dropzoneRef.current.querySelector("input").click()}
        style={{minHeight: "100px", minWidth: "300px"}}
      >
        {!preview && <p className="text-slate-300 text-center">Drag 'n' drop files here, or click</p>}
        {preview && <img src={preview} alt="Preview" className="preview-image w-full h-full" />}
        <input ref={inputRef} id="drag-drop-img" type="file" onChange={handleInputChange} style={{display: "none"}} />
      </div>
      {/* <form onSubmit={handleSubmit}> */}
      {/* <button type="submit" className="bg-indigo-600 w-full inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Upload</button> */}
      {/* </form> */}
    </div>
  );
}
