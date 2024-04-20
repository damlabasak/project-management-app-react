import React, { useContext, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import FilePreview from "../FilePreview";
import AttachmentRoundedIcon from '@mui/icons-material/AttachmentRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import ViewStreamRoundedIcon from '@mui/icons-material/ViewStreamRounded';
import WbIncandescentRoundedIcon from '@mui/icons-material/WbIncandescentRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import GrayLine from "../GrayLine/index";
import storeApi from "../../utils/storeApi";
import "./styles.scss";

export default function CardDetailModal({ show, onHide, card, listId, index }) {
  const [openTitleInput, setOpenTitleInput] = useState(false);
  const [newTitle, setNewTitle] = useState(card.title);
  const [openDescriptionInput, setOpenDescriptionInput] = useState(false);
  const [newDescription, setNewDescription] = useState(card.description);
  const [openDueDateInput, setOpenDueDateInput] = useState(false);
  const [newDueDate, setNewDueDate] = useState(card.dueDate);

  const { updateCardTitle, updateCardDescription, updateCardDueDate } = useContext(storeApi);

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

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          <ViewStreamRoundedIcon />
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
        ) : (
          <>
            {card?.description && (
              <>
                <div className="card-description">
                  <WbIncandescentRoundedIcon />
                  <p onClick={() => setOpenDescriptionInput(true)}>{card.description}</p>
                </div>
                <GrayLine />
              </>
            )}
          </>
        )}
        {openDueDateInput ? (
          <div className="due-date">
            <CalendarMonthRoundedIcon />
            <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              onBlur={handleDueDateOnBlur}
              autoFocus
            />
          </div>
        ) : (
          <>
            {card?.dueDate && (
              <>
                <div className="due-date">
                  <CalendarMonthRoundedIcon />
                  <p onClick={() => setOpenDueDateInput(true)}>Due Date: {card.dueDate}</p>
                </div>
                <GrayLine />
              </>
            )}
          </>
        )}
        {card?.filesData && (
          <>
            <div className="files-preview-title">
              <AttachmentRoundedIcon />
              <p>Attachments</p>
            </div>
            <div className="files-preview">
              {card?.filesData.map((file, index) => (
                <div className="file" key={index}>
                  <FilePreview fileUrl={file?.url} fileType={file?.type} />
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
                </div>
              ))}
            </div>
            <GrayLine />
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
