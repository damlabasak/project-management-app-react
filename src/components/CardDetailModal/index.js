import React from "react";
import { Modal, Button } from "react-bootstrap";
import FilePreview from "../FilePreview";
import AttachmentRoundedIcon from '@mui/icons-material/AttachmentRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import ViewStreamRoundedIcon from '@mui/icons-material/ViewStreamRounded';
import WbIncandescentRoundedIcon from '@mui/icons-material/WbIncandescentRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';

import GrayLine from "../GrayLine/index";
import "./styles.scss"

export default function CardDetailModal({ show, onHide, card }) {
  const handleOpenLink = (url) => {
    window.open(url, '_blank');
  };
  console.log(card?.selectedLabelsData) //sayfa yüklenirken çağrılıyor

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          <ViewStreamRoundedIcon/>
          <h3>{card?.title}</h3>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {card?.selectedLabelsData && (
          <>
            <div className="selected-labels">
            {card.selectedLabelsData.map((selectedLabel, index) => (
              <div className="selected-label" 
                style={{ 
                  color: selectedLabel.color, 
                  border: `1px solid ${selectedLabel.color}`,
                }} 
                key={index}>
                {selectedLabel.label}
              </div>
            ))}
            </div>
            <GrayLine />
          </>
        )}
        {card?.description && (
          <>
            <div className="card-description">
              <WbIncandescentRoundedIcon/>
              <p>{card.description}</p>
            </div>
            <GrayLine/>
          </>
        )}
        {card?.dueDate && (
          <>
            <div className="due-date">
              <CalendarMonthRoundedIcon/>
              <p>Due Date: {card.dueDate}</p>
            </div>
            <GrayLine/>
          </>
        )}
        {card?.filesData && (
          <>
          <div className="files-preview-title">
            <AttachmentRoundedIcon/>
            <p>
              Atthachments
            </p>
          </div>
          <div className="files-preview">
             {card?.filesData.map((file, index) => (
              <div className="file" key={index}>
                <FilePreview fileUrl={file?.url} fileType={file?.type} />
                <div className="file-actions">
                    <Button variant="light" className="open-file" onClick={() => handleOpenLink(file?.url)}>
                      Open
                      <OpenInNewRoundedIcon/>
                    </Button>                  
                  </div>
                </div>
              ))}
          </div>
          <GrayLine/>
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
