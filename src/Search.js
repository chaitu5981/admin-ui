import React, { useState } from "react";

const Search = ({ searchString, setSearchString, filter }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") filter();
  };
  return (
    <div className="search">
      <input
        type="text"
        name=""
        className="search-input"
        id=""
        value={searchString}
        onKeyDown={handleKeyDown}
        onChange={(e) => setSearchString(e.target.value)}
        placeholder="Search by name,email or role"
      />
    </div>
  );
};

export default Search;
