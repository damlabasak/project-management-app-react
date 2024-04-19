import React, { useState } from "react";

import InputCard from "../InputCard";
import { Button } from 'react-bootstrap';
import "./styles.scss";

export default function InputContainer({ listId, type }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="input-container">
      <div className="container" style={{ display: open ? 'block' : 'none' }}>
        <InputCard setOpen={setOpen} listId={listId} type={type} />
      </div>
      <div className="container" style={{ display: !open ? 'block' : 'none' }}>
        <div className="input-content">
          <Button onClick={() => setOpen(!open)}>
            {type === "card" ? "+ Add another card" : "+ Add another list"}
          </Button>
        </div>
      </div>
    </div>
  );  
}