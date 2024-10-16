import React, { useState } from 'react'
import "./SearchBar.css"

function SearchBar({onSearch}) {

  const [searchValue, setSearchValue] = useState('');

  function handleSearchChange(event){
    // call a method to render the search
    setSearchValue(event.target.value);
  }

  
  function handleSearchButton(){
    onSearch(searchValue);
  }

  return (
    <div className="SearchBar">
      <input placeholder="Enter A Song, Album, or Artist" onChange={handleSearchChange} />
      <button onClick={handleSearchButton} className="SearchButton">SEARCH</button>
    </div>
  )
}


export default SearchBar