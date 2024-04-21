import React, { useContext, useState } from "react";
import Button from 'react-bootstrap/Button';
import storeApi from "../../utils/storeApi";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc } from "firebase/firestore";
import chroma from 'chroma-js';

import AttachmentRoundedIcon from '@mui/icons-material/AttachmentRounded';
import TocRoundedIcon from '@mui/icons-material/TocRounded';
import WbIncandescentRoundedIcon from '@mui/icons-material/WbIncandescentRounded';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';

import GrayLine from "../GrayLine/index";

import { colourOptions } from '../../utils/labelColorOptions';
import Select from 'react-select';
import "./styles.scss";

export default function InputCard({ setOpen, listId, type/* , onSave */ }) {
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
    if (selectedOptions.length > 0) {
      setSelectedLabels(selectedOptions.map(option => ({
        value: option.value,
        color: option.color,
        label: option.label
      })));
    }
  };

  const handleOnChangeForDueDate = (e) => {
    setDueDate(e.target.value);
  };
  
  const handleBtnConfirm = async () => {
    let filesData = [];

    if (title.length < 5 || title.length > 50) {
      alert("Title must be between 5 and 50 characters.");
      return;
    }

    if (description.length < 5 || title.length > 200) {
      alert("Description must be between 5 and 200 characters.");
      return;
    }
    
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const currentFile = files[i];
        const fileRef = ref(storage, `files/${listId}/${doc.id}_${currentFile.name}`);
        await uploadBytes(fileRef, currentFile);
        const fileUrl = await getDownloadURL(fileRef);
  
        const fileType = currentFile.type;
        filesData.push({ url: fileUrl, type: fileType });
      }
    }
  
    let selectedLabelsData = [];
    
    if (selectedLabels && selectedLabels.length > 0) {
      for (let i = 0; i < selectedLabels.length; i++) {
        const currentLabel = selectedLabels[i];
        selectedLabelsData.push({value: currentLabel.value,
          color: currentLabel.color,
          label: currentLabel.label})
      } 
    }
  
    if (type === "card") {
      addMoreCard(title, description, filesData, dueDate, selectedLabelsData, listId);
    } else {
      addMoreList(title);
    }
    setOpen(false);
    setTitle("");
    setFiles(null);
    setDescription("");
    setDueDate("");
    setSelectedLabels(null);
    
    //onSave({ title, description, filesData, dueDate, selectedLabelsData });
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
        <div className="flex-container title-container">
          <TocRoundedIcon />
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
        </div>
          {type === "card" && (
            <>
              <div className="flex-container description-container">
                <WbIncandescentRoundedIcon />
                <textarea
                  onChange={handleOnChangeForDescription}
                  value={description}
                  className="input-text card-description"
                  placeholder="Enter a description of this card..."
                />
              </div>
              <div className="files-upload">
                <div className="flex-container files-upload-title">
                  <AttachmentRoundedIcon />
                  <p>Attachments</p>
                </div>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleOnChangeForFiles}
                  multiple
                />
              <GrayLine/>
              </div>
              <div className="due-date">
                  <div className="flex-container due-date-title">
                  <MoreTimeIcon />
                      <p>Due Date</p>
                  </div>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={handleOnChangeForDueDate}
                    className="input-text card-due-date"
                    placeholder="Enter due date..."
                  />
              </div>
              <div className="labels">
                <div className="flex-container labels-title">
                  <BookmarkRoundedIcon/>
                  <p>Labels</p>
                </div>
                <Select
                  className="select-label"
                  closeMenuOnSelect={false}
                  onChange={handleOnChangeForLabels}
                  isMulti
                  options={colourOptions}
                  styles={colourStyles}
                />
              </div>
            </>
          )}
      </div>
      <div className="confirm">
        <Button variant="success" className="button-confirm" onClick={handleBtnConfirm} >
          SAVE
        </Button>
        <Button variant="danger" className="button-cancel"
          onClick={() => {
            setTitle("");
            setDescription("");
            setFiles(null);
            setDueDate("");
            setSelectedLabels(null);
            setOpen(false);
          }}
        >
          CANCEL
        </Button>
      </div>
    </div>
  );
}
