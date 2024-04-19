import React, { useContext, useState } from "react";
import Button from 'react-bootstrap/Button';
import storeApi from "../../utils/storeApi";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc } from "firebase/firestore";

import "./styles.scss";

export default function InputCard({ setOpen, listId, type }) {
  const { addMoreCard, addMoreList } = useContext(storeApi);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const handleOnChangeForTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleOnChangeForDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleOnChangeForImage = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleBtnConfirm = async () => {
    let imageUrl = "";

    if (image) {
      const imageRef = ref(storage, `images/${listId}/${doc.id}_${image.name}`);
      await uploadBytes(imageRef, image);
      imageUrl = await getDownloadURL(imageRef);
    }

    if (type === "card") {
      addMoreCard(title, description, imageUrl, listId);
    } else {
      addMoreList(title);
    }
    setOpen(false);
    setTitle("");
    setImage(null);
    setDescription("");
};

  return (
    <div className="input-card">
      <div className="input-card-container">
        <textarea
          onChange={handleOnChangeForTitle}
          value={title}
          className="input-text card-title"
          placeholder={
            type === "card"
              ? "Enter a title of this card..."
              : "Enter list title"
          }
          autoFocus
        />
        {type === "card" && (
          <>
            <textarea
              onChange={handleOnChangeForDescription}
              value={description}
              className="input-text card-description"
              placeholder="Enter a description of this card..."
            />
            <div className="image-upload">
              <input
                type="file"
                onChange={handleOnChangeForImage}
                accept="image/*"
              />
            </div>
          </>
        )}
        
      </div>
      <div className="confirm">
        <Button variant="success" className="button-confirm" onClick={handleBtnConfirm}>
          OK
        </Button>
        <Button variant="danger" className="button-cancel"
          onClick={() => {
            setTitle("");
            setDescription("");
            setOpen(false);
          }}
        >
          CANCEL
        </Button>
      </div>
    </div>
  );
}
