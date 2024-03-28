import React from 'react';

const PromptComponent = ({ message, defaultValue, onConfirm, onCancel }) => {
    const [value, setValue] = React.useState(defaultValue || '');
  
    const handleInputChange = (event) => {
      setValue(event.target.value);
    };
  
    const handleConfirm = () => {
      onConfirm(value);
    };
  
    const handleCancel = () => {
      onCancel();
    };
  
    return (
      <div className="container bg-primary p-2 prompt-component">
        <div className="prompt-message">{message}</div>
        <input
          type="text"
          className="prompt-input"
          value={value}
          onChange={handleInputChange}
        />
        <button className="prompt-button" onClick={handleConfirm}>
          Confirm
        </button>
        <button className="prompt-button" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    );
  };

export default PromptComponent;  