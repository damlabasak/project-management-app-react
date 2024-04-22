import React, { useContext, useState, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import { FilePond } from "react-filepond";
import DatePicker from "react-datepicker";
import ReactQuill from "react-quill";
import FilePreview from "../FilePreview";
import AttachmentRoundedIcon from "@mui/icons-material/AttachmentRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import TocRoundedIcon from "@mui/icons-material/TocRounded";
import WbIncandescentRoundedIcon from "@mui/icons-material/WbIncandescentRounded";
import QueryBuilderRoundedIcon from "@mui/icons-material/QueryBuilderRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import NotesRoundedIcon from '@mui/icons-material/NotesRounded';
import Person3Icon from '@mui/icons-material/Person3';
import EditIcon from "@mui/icons-material/Edit";
import GrayLine from "../GrayLine/index";
import storeApi from "../../utils/storeApi";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc } from "firebase/firestore";

import "react-quill/dist/quill.snow.css";
import "./styles.scss";

export default function CardDetailModal({ show, onHide, card, listId, index }) {
  const [openTitleInput, setOpenTitleInput] = useState(false);
  const [newTitle, setNewTitle] = useState(card.title);
  const [openDescriptionInput, setOpenDescriptionInput] = useState(false);
  const [newDescription, setNewDescription] = useState(card.description);
  const [newDueDate, setNewDueDate] = useState(card.dueDate);
  const [updatedFiles, setUpdatedFiles] = useState(card.filesData);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [newComment, setNewComment] = useState("");

  const datePickerRef = useRef(null);

  const {
    updateCardTitle,
    updateCardDescription,
    updateCardDueDate,
    deleteCardFile,
    addCardFile,
    addComment,
  } = useContext(storeApi);

  function formatDate(inputDate) {
    const dateObject = new Date(inputDate);

    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const day = String(dateObject.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  }

  const handleTitleOnBlur = () => {
    updateCardTitle(newTitle, index, listId);
    setOpenTitleInput(false);
  };

  const handleDescriptionOnBlur = () => {
    updateCardDescription(newDescription, index, listId);
    setOpenDescriptionInput(false);
  };

  const handleDueDateOnBlur = () => {
    updateCardDueDate(newDueDate, index, listId);
  };

  const handleOpenLink = (url) => {
    window.open(url, "_blank");
  };

  const handleDeleteFile = (fileIndex) => {
    deleteCardFile(fileIndex, listId, card.id);
    const updatedFiles = card.filesData.filter(
      (file, index) => index !== fileIndex
    );
    setUpdatedFiles(updatedFiles);
  };

  const handleFileInputChange = (files) => {
    setSelectedFiles(files);
  };

  const handleSaveFiles = async () => {
    const filesData = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      const currentFile = selectedFiles[i].file;
      const fileRef = ref(
        storage,
        `files/${listId}/${doc.id}_${currentFile.name}`
      );
      await uploadBytes(fileRef, currentFile);
      const fileUrl = await getDownloadURL(fileRef);
      filesData.push({ url: fileUrl, type: currentFile.type });
    }
    addCardFile(filesData, listId, card.id);
    setUpdatedFiles(filesData);
  };

  const handleEditDueDateClick = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(true);
    }
  };

  const handleAddComment = () => {
    addComment(newComment, listId, card.id);
    setNewComment("");
  };

  return (
    <Modal show={show} onHide={onHide} id="cardDetailModal" size="md">
      <Modal.Header>
        <Modal.Title>
          <TocRoundedIcon />
          <h3>
            {openTitleInput ? (
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onBlur={handleTitleOnBlur}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleTitleOnBlur(card.id);
                  }
                  return;
                }}
                autoFocus
              />
            ) : (
              <span onClick={() => setOpenTitleInput(true)}>{card?.title}</span>
            )}

            <Button
              className="edit-btn"
              onClick={() => setOpenTitleInput(!openTitleInput)}
            >
              <EditIcon />
            </Button>
          </h3>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {card?.selectedLabelsData && (
          <>
            <div className="selected-labels">
              {card.selectedLabelsData.map((selectedLabel, index) => (
                <div
                  className="selected-label"
                  style={{
                    color: selectedLabel.color,
                    border: `1px solid ${selectedLabel.color}`,
                  }}
                  key={index}
                >
                  {selectedLabel.label}
                </div>
              ))}
            </div>
            <GrayLine />
          </>
        )}
        {openDescriptionInput || !card?.description ? (
          <>
            <div className="card-description-container">
              <div className="card-description">
                <WbIncandescentRoundedIcon />
                <ReactQuill
                  theme="snow"
                  onChange={(content) => setNewDescription(content)}
                  value={newDescription}
                  onBlur={handleDescriptionOnBlur}
                  placeholder="Write a description..."
                />
              </div>
            </div>
            <GrayLine />
          </>
        ) : (
          <>
            {card?.description && (
              <>
                <div className="card-description-container">
                  <div className="card-description">
                    <WbIncandescentRoundedIcon />
                    <p
                      onClick={() => setOpenDescriptionInput(true)}
                      dangerouslySetInnerHTML={{ __html: card.description }}
                    ></p>
                  </div>
                  <Button
                    className="edit-btn"
                    onClick={() =>
                      setOpenDescriptionInput(!openDescriptionInput)
                    }
                  >
                    <EditIcon />
                  </Button>
                </div>
                <GrayLine />
              </>
            )}
            {!card?.description && (
              <>
                <div className="card-description-container">
                  <div className="card-description">
                    <WbIncandescentRoundedIcon />
                    <textarea
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      onBlur={handleDescriptionOnBlur}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleDescriptionOnBlur(card.id);
                        }
                        return;
                      }}
                      autoFocus
                    />
                  </div>
                </div>
                <GrayLine />
              </>
            )}
          </>
        )}
        <div className="due-date-container">
          <div className="due-date">
            <QueryBuilderRoundedIcon />
            <p>Due Date: </p>
            <DatePicker
              ref={datePickerRef}
              selected={
                newDueDate
                  ? new Date(newDueDate)
                  : card.dueDate
                  ? new Date(card.dueDate)
                  : null
              }
              onSelect={(date) => {
                setNewDueDate(formatDate(date));
                handleDueDateOnBlur();
              }}
              onBlur={handleDueDateOnBlur}
              placeholderText=" There is no due date"
            />
          </div>
          <Button
            className="duedate-edit edit-btn"
            onClick={handleEditDueDateClick}
          >
            <EditIcon />
          </Button>
        </div>
        <GrayLine />
        <div className="files-preview-title">
          <AttachmentRoundedIcon />
          <p>Attachments</p>
        </div>
        <div className="files-preview">
          {card?.filesData && card.filesData.length > 0 ? (
            card.filesData.map((file, index) => (
              <div className="file" key={index}>
                <div className="file-actions">
                  <Button
                    variant="light"
                    className="open-file"
                    onClick={() => handleOpenLink(file?.url)}
                  >
                    Open
                    <OpenInNewRoundedIcon />
                  </Button>
                </div>
                <FilePreview fileUrl={file?.url} fileType={file?.type} />
                <div className="file-actions">
                  <Button
                    variant="light"
                    className="delete-file"
                    onClick={() => handleDeleteFile(index)}
                  >
                    <DeleteOutlineRoundedIcon />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p>There is no file uploaded</p>
          )}
        </div>
        <div className="info-for-upload-files">
          <ArrowDownwardRoundedIcon />
          <p>
            Drag & drop files or browse, than click{" "}
            <span>
              <strong>Upload</strong>
            </span>{" "}
            button to upload new files
          </p>
        </div>
        <div className="upload-new-files">
          <div className="files-upload">
            <FilePond
              files={selectedFiles}
              allowMultiple={true}
              onupdatefiles={handleFileInputChange}
            />
          </div>
          <div className="confirm">
            <Button
              variant="success"
              className="button-confirm"
              onClick={handleSaveFiles}
            >
              Upload
            </Button>
          </div>
        </div>
        <GrayLine />
        <div className="comment-section">
          <div className="comment-section-title">
            <NotesRoundedIcon/>
            <p>Comments</p>
          </div>
          <div className="comment-list">
            {card.comments && card.comments.length > 0 ? (
              card.comments.map((comment, idx) => (
                <div className="comment-line">
                  <Person3Icon/>
                  <div className="comment" key={idx}>
                    <p dangerouslySetInnerHTML={{ __html: comment }}></p>
                  <GrayLine />
                  </div>
                </div>
              ))
            ) : (
              <p>No comments yet</p>
            )}
          </div>
          <div className="add-comment">
            <ReactQuill
              theme="snow"
              value={newComment}
              onChange={(content) => setNewComment(content)}
              placeholder="Add a comment..."
            />
            <Button variant="primary" className="btn-add-comment" onClick={handleAddComment}>
              <SendRoundedIcon />
            </Button>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
