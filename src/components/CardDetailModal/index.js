import React from "react";
import { Modal, Button } from "react-bootstrap";

export default function CardDetailModal({ show, onHide, card }) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Card Detail</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>{card.title}</h4>
        <p>{card.description}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
