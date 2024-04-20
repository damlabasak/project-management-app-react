import React, { useState, useEffect, useRef, useContext } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Button } from 'react-bootstrap';
import storeApi from "../../utils/storeApi";
import "./styles.scss";

export default function Title({ title, listId }) {
  const [openOptions, setOpenOptions] = useState(false);
  const { deleteList } = useContext(storeApi);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpenOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

  return (
    <div className="editable-title-container" ref={ref}>
      <h2 className="editable-title">
        {title}
      </h2>
      <Button
        className="list-button"
        onClick={() => setOpenOptions(!openOptions)}
      >
        <MoreVertIcon />
      </Button>
      {openOptions && (
        <ul className="menu-card">
          <li
            onClick={() => {
              setOpenOptions(!openOptions);
              deleteList(listId);
            }}
          >
            Delete list
          </li>
        </ul>
      )}
    </div>
  );
}
