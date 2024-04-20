import React, { useContext, useState } from "react";

import TextareaAutosize from "react-textarea-autosize";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import { Draggable } from "react-beautiful-dnd";

import storeApi from "../../utils/storeApi";

import { Button } from 'react-bootstrap';

import "./styles.scss";

export default function Card({ card, index, listId }) {
  const [open, setOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(card.title);
  const { removeCard, updateCardTitle } = useContext(storeApi);

  const handleOnBlur = (cardId) => {
    updateCardTitle(newTitle, index, listId);
    setOpen(!open);
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
                <p onClick={() => setOpen(!open)}>{card.title}</p>
                <div className="icons">
                  <Button
                    onClick={() => {
                      removeCard(index, listId, card.id);
                    }}
                  >
                    <DeleteOutlineIcon />
                  </Button>
                  <Button
                    onClick={() => setOpen(!open)}
                  >
                    <EditIcon />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
