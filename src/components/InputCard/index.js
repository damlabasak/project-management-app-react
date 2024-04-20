import React, { useContext, useState } from "react";
import Button from 'react-bootstrap/Button';
import storeApi from "../../utils/storeApi";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc } from "firebase/firestore";
import chroma from 'chroma-js';

import { colourOptions } from '../../utils/labelColorOptions';
import Select from 'react-select';
import "./styles.scss";

export default function InputCard({ setOpen, listId, type, onSave }) {
  const { addMoreCard, addMoreList } = useContext(storeApi);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState(null);
  const [dueDate, setDueDate] = useState("");
  const [selectedLabels, setSelectedLabels] = useState(null);

  const handleOnChangeForTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleOnChangeForDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleOnChangeForFiles = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const filesArray = Array.from(files);
      setFiles(filesArray);
    }
  };

  const handleOnChangeForLabels = (selectedOptions) => {
    console.log(selectedOptions)
    setSelectedLabels(selectedOptions);
  };

  const handleOnChangeForDueDate = (e) => {
    setDueDate(e.target.value);
  };
  
  const handleBtnConfirm = async () => {
    let filesUrls = [];
  
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const currentFile = files[i];
        const fileRef = ref(storage, `files/${listId}/${doc.id}_${currentFile.name}`);
        await uploadBytes(fileRef, currentFile);
        const fileUrl = await getDownloadURL(fileRef);
        filesUrls.push(fileUrl);
      }
    }

    let selectedLabelsValues = [];
  
    if (selectedLabels && selectedLabels.length > 0) {
      for (let i = 0; i < selectedLabels.length; i++) {
        selectedLabelsValues.push(selectedLabels[i].value);
      }
      console.log(selectedLabelsValues)
    }

    if (type === "card") {
      addMoreCard(title, description, filesUrls, dueDate, selectedLabelsValues, listId);
    } else {
      addMoreList(title);
    }
    setOpen(false);
    setTitle("");
    setFiles(null);
    setDescription("");
    setDueDate("");
    setSelectedLabels(null);
    
    onSave({ title, description, filesUrls, dueDate, selectedLabelsValues });
  };

  const colourStyles = {
    control: (styles) => ({ ...styles, backgroundColor: 'white' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: isDisabled
          ? undefined
          : isSelected
          ? data.color
          : isFocused
          ? color.alpha(0.1).css()
          : undefined,
        color: isDisabled
          ? '#ccc'
          : isSelected
          ? chroma.contrast(color, 'white') > 2
            ? 'white'
            : 'black'
          : data.color,
        cursor: isDisabled ? 'not-allowed' : 'default',
  
        ':active': {
          ...styles[':active'],
          backgroundColor: !isDisabled
            ? isSelected
              ? data.color
              : color.alpha(0.3).css()
            : undefined,
        },
      };
    },
    multiValue: (styles, { data }) => {
      const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: color.alpha(0.1).css(),
      };
    },
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      color: data.color,
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      color: data.color,
      ':hover': {
        backgroundColor: data.color,
        color: 'white',
      },
    }),
  };
  
  return (
    <div className={"input-card"}>
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
            <div className="files-upload">
              <input
                type="file"
                onChange={handleOnChangeForFiles}
                multiple
              />
            </div>
            <div className="due-date">
              <h6 className="due-date-title">Due Date</h6>
              <input
                type="date"
                value={dueDate}
                onChange={handleOnChangeForDueDate}
                className="input-text card-due-date"
                placeholder="Enter due date..."
              />
            </div>
            <Select
              closeMenuOnSelect={false}
              defaultValue={[colourOptions[0], colourOptions[1]]}
              onChange={handleOnChangeForLabels}
              isMulti
              options={colourOptions}
              styles={colourStyles}
            />
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
