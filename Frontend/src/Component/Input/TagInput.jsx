import React, { useState } from 'react';
import { MdAdd, MdClose } from "react-icons/md";

function TagInput({ tags, setTags }) {
  const [inputValue, setInputValue] = useState("");

  function handleInputChange(e) {
    setInputValue(e.target.value);
  }

  function addNewTag() {
    if (inputValue.trim() !== "") {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      addNewTag();
    }
  }

  function handleRemoveTag(tagToRemove) {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  }

  return (
    <div>
      {/* Tag List */}
      {tags?.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mt-2">
          {tags.map((tag, index) => (
            <span key={index} className="bg-gray-200 px-2 py-1 rounded flex items-center gap-2">
              # {tag}
              <button onClick={() => handleRemoveTag(tag)}>
                <MdClose className="text-red-500 cursor-pointer" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input and Add Button */}
      <div className="flex items-center gap-4 mt-3">
        <input
          type="text"
          className="text-sm bg-transparent border px-3 py-2 rounded outline-none"
          placeholder="Add Tags"
          value={inputValue}  
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />

        <button
          className="w-8 h-8 flex items-center justify-center border rounded border-blue-700 hover:bg-blue-700"
          onClick={addNewTag}
        >
          <MdAdd className="text-2xl text-blue-600 hover:text-white" />
        </button>
      </div>
    </div>
  );
}

export default TagInput;
