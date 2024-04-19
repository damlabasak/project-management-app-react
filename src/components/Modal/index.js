import React from "react";
import { Modal } from "react-bootstrap";
import InputCard from "../InputCard";
import "./styles.scss";

export default function InputModal({ show, onHide, type, listId, listTitle }) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header>
        <Modal.Title>Add {type === "card" ? `card for "${listTitle}" list` : "list"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputCard setOpen={onHide} listId={listId} type={type} />
      </Modal.Body>
    </Modal>
  );
}
