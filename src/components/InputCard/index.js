import React, { useContext, useState } from "react";
import Button from 'react-bootstrap/Button';
import storeApi from "../../utils/storeApi";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc } from "firebase/firestore";
import chroma from 'chroma-js';
import { FilePond } from 'react-filepond';
import AttachmentRoundedIcon from '@mui/icons-material/AttachmentRounded';
import TocRoundedIcon from '@mui/icons-material/TocRounded';
import WbIncandescentRoundedIcon from '@mui/icons-material/WbIncandescentRounded';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';
import DatePicker from "react-datepicker";
import GrayLine from "../GrayLine/index";

import { colourOptions } from '../../utils/labelColorOptions';
import Select from 'react-select';
import "./styles.scss";
import 'filepond/dist/filepond.min.css';
import "react-datepicker/dist/react-datepicker.css";

export default function InputCard({ setOpen, listId, type/* , onSave */ }) {
  const { addMoreCard, addMoreList } = useContext(storeApi);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [dueDate, setDueDate] = useState("");
  const [selectedLabels, setSelectedLabels] = useState(null);

  const handleOnChangeForTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleOnChangeForDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleOnChangeForFiles = (files) => {
    setFiles(files);
  };

  const handleOnChangeForLabels = (selectedOptions) => {
    setSelectedLabels(selectedOptions);
  };

  function formatDate(inputDate) {
    const dateObject = new Date(inputDate);
  
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');
  
    const formattedDate = `${year}-${month}-${day}`;
  
    return formattedDate;
  }

  const handleOnChangeForDueDate = (date) => {
    setDueDate(formatDate(date));
  };
  
  const handleBtnConfirm = async () => {
    if (title.length < 5 || title.length > 50) {
      alert("Title must be between 5 and 50 characters.");
      return;
    }

    const filesData = [];
    for (let i = 0; i < files.length; i++) {
      const currentFile = files[i].file;
      const fileRef = ref(storage, `files/${listId}/${doc.id}_${currentFile.name}`);
      await uploadBytes(fileRef, currentFile);
      const fileUrl = await getDownloadURL(fileRef);
      filesData.push({ url: fileUrl, type: currentFile.type });
    }

    let selectedLabelsData = [];
    if (selectedLabels && selectedLabels.length > 0) {
      selectedLabelsData = selectedLabels.map(label => ({
        value: label.value,
        color: label.color,
        label: label.label
      }));
    }

    if (type === "card") {
      addMoreCard(title, description, filesData, dueDate, selectedLabelsData, listId);
    } else {
      addMoreList(title);
    }
    setOpen(false);
    setTitle("");
    setFiles([]);
    setDescription("");
    setDueDate("");
    setSelectedLabels(null);
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
                  maxLength={200}
                  className="input-text card-description"
                  placeholder="Enter a description of this card..."
                />
              </div>
              <div className="files-upload">
                <div className="flex-container files-upload-title">
                  <AttachmentRoundedIcon />
                  <p>Attachments</p>
                </div>
                <FilePond
                  files={files}
                  allowMultiple={true}
                  onupdatefiles={handleOnChangeForFiles}
                />
              <GrayLine/>
              </div>
              <div className="due-date">
                <div className="flex-container due-date-title">
                <MoreTimeIcon />
                    <p>Due Date</p>
                </div>
                <DatePicker
                  selected={dueDate}
                  onChange={handleOnChangeForDueDate}
                  dateFormat="yyyy-MM-dd"
                  placeholderText=" Enter due date..."
                />
              <GrayLine/>
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
            setFiles([]);
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
