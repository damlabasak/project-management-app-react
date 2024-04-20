import React, { useContext, useState } from "react";

import TextareaAutosize from "react-textarea-autosize";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import OpenWithIcon from '@mui/icons-material/OpenWith';
import { Draggable } from "react-beautiful-dnd";

import storeApi from "../../utils/storeApi";
import { Button } from 'react-bootstrap';

import "./styles.scss";
import CardDetailModal from "../CardDetailModal/index";

export default function Card({ card, index, listId }) {
  const [open, setOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(card.title);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { removeCard, updateCardTitle } = useContext(storeApi);

  const handleOnBlur = (cardId) => {
    updateCardTitle(newTitle, index, listId);
    setOpen(!open);
  };

  const openDetailModal = () => {
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + " ...";
    } else {
      return text;
    }
  };

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          <div className="card-content">
            {open ? (
              <TextareaAutosize
                type="text"
                className="input-card-title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onBlur={handleOnBlur}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleOnBlur(card.id);
                  }
                  return;
                }}
                autoFocus
              />
            ) : (
              <div className="card-title-container">
                <p onClick={() => setOpen(!open)} title={card.title}>
                  {truncateText(card.title, 35)}
                </p>
                <div className="icons">
                  <Button className="btn-remove-card"
                    onClick={() => {
                      removeCard(index, listId, card.id);
                    }}
                  >
                    <DeleteOutlineIcon />
                  </Button>
                  <Button className="btn-edit-card-title"
                    onClick={() => setOpen(!open)}
                  >
                    <EditIcon />
                  </Button>
                  <Button className="btn-open-detail"
                    onClick={openDetailModal}
                  >
                    <OpenWithIcon/>
                  </Button>
                </div>
              </div>
            )}
          </div>
          <CardDetailModal
            show={showDetailModal}
            onHide={closeDetailModal}
            card={card}
            listId={listId}
            index={index}
          />
        </div>
      )}
    </Draggable>
  );
}