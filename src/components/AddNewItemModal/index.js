import React from "react";
import { Modal } from "react-bootstrap";
import InputCard from "../InputCard";
import AddTaskIcon from '@mui/icons-material/AddTask';

import "./styles.scss";

export default function InputModal({ show, onHide, type, listId, listTitle }) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header>
        <Modal.Title>
          <AddTaskIcon/>
          <h4>
            Add {type === "card" ? `card for "${listTitle}" list` : "a new list"}
          </h4>
          </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputCard setOpen={onHide} listId={listId} type={type} />
      </Modal.Body>
    </Modal>
  );
}
