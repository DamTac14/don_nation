import React from "react";

function InputForm({ 
  label, 
  inputType, 
  name, 
  id, 
  onClick, 
  value, 
  rows, 
  cols, 
  placeholder, 
  minLength,
  accept }) {

  
  return (
    <div className="form-field">

      <label htmlFor={name}>{label}</label>
      {inputType === "textarea" ? (
        <textarea
          name={name}
          value={value}
          id={id}
          placeholder={placeholder}
          rows={rows}
          cols={cols}
        />

      ) : (
        
        <input
          type={inputType}
          name={name}
          value={value}
          id={id}
          minLength={minLength}
          placeholder={placeholder}
          accept={accept}
          onClick={onClick}
        />
      )}
    </div>
  );
};

export default InputForm;
