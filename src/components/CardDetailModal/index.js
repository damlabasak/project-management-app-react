import React, { useContext, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { FilePond } from 'react-filepond';
import FilePreview from "../FilePreview";
import AttachmentRoundedIcon from '@mui/icons-material/AttachmentRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import TocRoundedIcon from '@mui/icons-material/TocRounded';
import WbIncandescentRoundedIcon from '@mui/icons-material/WbIncandescentRounded';
import QueryBuilderRoundedIcon from '@mui/icons-material/QueryBuilderRounded';
import EditIcon from '@mui/icons-material/Edit';
import GrayLine from "../GrayLine/index";
import storeApi from "../../utils/storeApi";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc } from "firebase/firestore";

import "./styles.scss";

export default function CardDetailModal({ show, onHide, card, listId, index }) {
  const [openTitleInput, setOpenTitleInput] = useState(false);
  const [newTitle, setNewTitle] = useState(card.title);
  const [openDescriptionInput, setOpenDescriptionInput] = useState(false);
  const [newDescription, setNewDescription] = useState(card.description);
  const [openDueDateInput, setOpenDueDateInput] = useState(false);
  const [newDueDate, setNewDueDate] = useState(card.dueDate);
  const [updatedFiles, setUpdatedFiles] = useState(card.filesData);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const { updateCardTitle, updateCardDescription, updateCardDueDate, deleteCardFile, addCardFile } = useContext(storeApi);

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
    setOpenDueDateInput(false);
  };

  const handleOpenLink = (url) => {
    window.open(url, '_blank');
  };

  const handleDeleteFile = (fileIndex) => {
    deleteCardFile(fileIndex, listId, card.id);
    const updatedFiles = card.filesData.filter((file, index) => index !== fileIndex);
    setUpdatedFiles(updatedFiles);
  };

  const handleFileInputChange = (files) => {
    setSelectedFiles(files);
  };

  const handleSaveFiles = async () => {
    const filesData = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      const currentFile = selectedFiles[i].file;
      const fileRef = ref(storage, `files/${listId}/${doc.id}_${currentFile.name}`);
      await uploadBytes(fileRef, currentFile);
      const fileUrl = await getDownloadURL(fileRef);
      filesData.push({ url: fileUrl, type: currentFile.type });
    }
    addCardFile(filesData, listId, card.id);
    setUpdatedFiles(filesData);
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
            
            <Button className="edit-btn" onClick={() => setOpenTitleInput(!openTitleInput)}>
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
        {openDescriptionInput ? (
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
        ) : (
          <>
            {card?.description && (
              <>
                <div className="card-description-container">
                  <div className="card-description">
                    <WbIncandescentRoundedIcon />
                    <p onClick={() => setOpenDescriptionInput(true)}>{card.description}</p>
                  </div>
                  <Button className="edit-btn" onClick={() => setOpenDescriptionInput(!openDescriptionInput)}>
                    <EditIcon />
                  </Button>
                </div>
                <GrayLine />
              </>
            )}
          </>
        )}
        {openDueDateInput ? (
          <div className="due-date-container">
            <div className="due-date">
              <QueryBuilderRoundedIcon />
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                onBlur={handleDueDateOnBlur}
                autoFocus
              />
            </div>
            <GrayLine />
          </div>
        ) : (
          <>
            {card?.dueDate && (
              <div className="due-date-container">
                <div className="due-date">
                  <QueryBuilderRoundedIcon />
                  <p onClick={() => setOpenDueDateInput(true)}>Due Date: {card.dueDate}</p>
                </div>
                <Button className="duedate-edit edit-btn" onClick={() => setOpenDueDateInput(!openDueDateInput)}>
                  <EditIcon />
                </Button>
                <GrayLine />
              </div>
            )}
          </>
        )}
        {card?.filesData && card.filesData.length > 0 && (
        <>
          <div className="files-preview-title">
            <AttachmentRoundedIcon />
            <p>Attachments</p>
          </div>
          <div className="files-preview">
            {card?.filesData.map((file, index) => (
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
            ))}
          </div>
          <div className="upload-new-files">
            <div className="files-upload">
              <div className="flex-container files-upload-title">
                <AttachmentRoundedIcon />
                <p>Upload Files</p>
              </div>
              <FilePond
                files={selectedFiles}
                allowMultiple={true}
                onupdatefiles={handleFileInputChange}
              />
            </div>
            <GrayLine />
            <div className="confirm">
              <Button variant="success" className="button-confirm" onClick={handleSaveFiles} >
                Upload
              </Button>
            </div>
          </div>
        </>
      )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
