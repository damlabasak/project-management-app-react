import React, { useState } from "react";
import { Button } from 'react-bootstrap';
import InputModal from "../AddNewItemModal/index";
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';

import "./styles.scss";

export default function InputContainer({ listId, type, listTitle }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`input-container ${type === "list" ? "list" : ""}`}>
    <Button onClick={() => setOpen(true)}>
      <AddBoxRoundedIcon/>
      {type === "card" ? " Add a card" : " Add a list"}
    </Button>

    <InputModal show={open} onHide={() => setOpen(false)} type={type} listId={listId} listTitle={listTitle} />
  </div>
  );  
}
