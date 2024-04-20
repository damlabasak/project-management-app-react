import React, { useContext, useState } from "react";
import Button from 'react-bootstrap/Button';
import storeApi from "../../utils/storeApi";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc } from "firebase/firestore";

import "./styles.scss";

export default function InputCard({ setOpen, listId, type }) {
  const { addMoreCard, addMoreList } = useContext(storeApi);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState(null);
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState(""); // State for priority

  const handleOnChangeForTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleOnChangeForDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleOnChangeForFiles = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const filesArray = Array.from(files);
      setFiles(filesArray);
    }
  };

  const handleOnChangeForDueDate = (e) => {
    setDueDate(e.target.value);
  };

  const handlePriorityChange = (e) => {
    setPriority(e.target.value);
  };
  
  const handleBtnConfirm = async () => {
    let filesUrls = [];
  
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const currentFile = files[i];
        const fileRef = ref(storage, `files/${listId}/${doc.id}_${currentFile.name}`);
        await uploadBytes(fileRef, currentFile);
        const fileUrl = await getDownloadURL(fileRef);
        filesUrls.push(fileUrl);
      }
    }
  
    if (type === "card") {
      addMoreCard(title, description, filesUrls, dueDate, listId, priority); // Passing priority to addMoreCard
    } else {
      addMoreList(title);
    }
    setOpen(false);
    setTitle("");
    setFiles(null);
    setDescription("");
    setDueDate("");
    setPriority("");
  };

  return (
    <div className={`input-card ${priority ? `priority-${priority}` : ""}`}>
      <div className="input-card-container">
        <textarea
          onChange={handleOnChangeForTitle}
          value={title}
          className="input-text card-title"
          placeholder={
            type === "card"
              ? "Enter a title of this card..."
              : "Enter list title"
          }
          autoFocus
        />
        {type === "card" && (
          <>
            <textarea
              onChange={handleOnChangeForDescription}
              value={description}
              className="input-text card-description"
              placeholder="Enter a description of this card..."
            />
            <div className="files-upload">
              <input
                type="file"
                onChange={handleOnChangeForFiles}
                multiple
              />
            </div>
            <div className="due-date">
              <h6 className="due-date-title">Due Date</h6>
              <input
                type="date"
                value={dueDate}
                onChange={handleOnChangeForDueDate}
                className="input-text card-due-date"
                placeholder="Enter due date..."
              />
            </div>
            <div className="priority">
              <label>Label:</label>
              <select value={priority} onChange={handlePriorityChange}>
                <option value="">Select label</option>
                <option value="red">High (Red)</option>
                <option value="yellow">Medium (Yellow)</option>
                <option value="green">Low (Green)</option>
              </select>
            </div>
          </>
        )}
        
      </div>
      <div className="confirm">
        <Button variant="success" className="button-confirm" onClick={handleBtnConfirm}>
          OK
        </Button>
        <Button variant="danger" className="button-cancel"
          onClick={() => {
            setTitle("");
            setDescription("");
            setOpen(false);
          }}
        >
          CANCEL
        </Button>
      </div>
    </div>
  );
}
