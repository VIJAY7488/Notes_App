import React, { useState } from "react";
import ProfileInfo from "../Card/ProfileInfo";
import { useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";

function Navbar({ userInfo, searchNotes }) {
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  function onLogout() {
    localStorage.clear();
    navigate("/");
  }

  function handleSearch() {
    if (searchQuery.trim()) {
      searchNotes(searchQuery);
    } else {
      searchNotes(""); 
    }
  }
  

  function onClearSearch() {
    setSearchQuery("");
    searchNotes("");
  }
  
  if (!userInfo) return null;

  
  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
      <h2 className="text-xl font-medium text-black py-2">Notes</h2>

      <SearchBar
        value={searchQuery}
        onChange={({ target }) => setSearchQuery(target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
        handlesearch={handleSearch}
        onClearSearch={onClearSearch}
      />

      <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
    </div>
  );
}

export default Navbar;
