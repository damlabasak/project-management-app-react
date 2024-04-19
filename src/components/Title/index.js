import React, { useState, useEffect, useRef, useContext } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Button } from 'react-bootstrap';
import storeApi from "../../utils/storeApi";
import "./styles.scss";

export default function Title({ title, listId }) {
  const [open, setOpen] = useState(false);
  const [openOptions, setOpenOptions] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const { updateListTitle, deleteList } = useContext(storeApi);
  const ref = useRef(null); // Referans oluştur

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
        setOpenOptions(false);
      }
    };

    // Event listener'ı ekle
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Event listener'ı kaldır
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

  const handleOnBlur = () => {
    updateListTitle(newTitle, listId);
    setOpen(false);
  };

  return (
    <>
      {open ? (
        <div>
          <input
            type="text"
            className="input-title"
            value={newTitle}
            onChange={(e) => {
              setNewTitle(e.target.value);
            }}
            onBlur={handleOnBlur}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleOnBlur();
              }
              return;
            }}
            autoFocus
          />
        </div>
      ) : (
        <div className="editable-title-container" ref={ref}>
          <h2 onClick={() => setOpen(!open)} className="editable-title">
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
              <li
                onClick={() => {
                  setOpenOptions(!openOptions);
                  setOpen(!open);
                }}
              >
                Edit card title
              </li>
            </ul>
          )}
        </div>
      )}
    </>
  );
}
