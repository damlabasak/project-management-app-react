import React, { useState } from "react";
import { Button } from 'react-bootstrap';
import InputModal from "../Modal/index";
import "./styles.scss";

export default function InputContainer({ listId, type, listTitle }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="input-container ">
    <Button onClick={() => setOpen(true)}>
      {type === "card" ? "+ Add another card" : "+ Add another list"}
    </Button>

    <InputModal show={open} onHide={() => setOpen(false)} type={type} listId={listId} listTitle={listTitle} />
  </div>
  );  
}
