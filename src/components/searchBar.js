

import React, { useState } from 'react';
import '../style/searchBar.css'



function Search() {

  // Create state to store of value
  const [searchValue, setSearchValue] = useState('');

  function searchData(event) {
    let input = document.getElementById('searchbar').value;
    // Retrieving value from input

    let cleanedInput = input.replace(/[^a-zA-Z0-9]/g, '').toLowerCase(); 
    //delete non-alphanumeric characters and change to lowercase which avoids having to type letters for letters,
    // word for word what we want and have a more appreciable search

    let lettre = document.getElementsByClassName('search');
    // allows to retrieve the values ​​corresponding to the search which will be in the tags whose class will be "search"

    // Loop that checks the letters as it goes
    for (var i = 0; i < lettre.length; i++) {

      let cleanedText = lettre[i].innerHTML.replace(/[^a-zA-Z0-9]/g, '').toLowerCase(); 
    //delete non-alphanumeric characters and change to lowercase which avoids having to type letters for letters,
    // word for word what we want and have a more appreciable search
    
    if (!cleanedText.includes(cleanedInput)) {
        lettre[i].style.display = "none";
      } else{
        lettre[i].style.display = "";
      }
      // Conditions that allow the appearance or not of the expected data
    }
    setSearchValue(input);
  }
  
  
  function deleteSearch() {
    setSearchValue("");

    document.getElementById('searchbar').value = "";

    let lettre = document.getElementsByClassName('search');

    for (var i = 0; i < lettre.length; i++) {
      lettre[i].style.display = "";
    }
  }
  
  return (
    <div className="search-container">
      <input
        id={'searchbar'}
        onKeyUp={(event) => searchData(event)}
        type={'text'}
        placeholder={'Rechercher'}
      />

      {searchValue.length > 0 && (
        <button className="deleteSearch" 
        onClick={() => deleteSearch()}>
          X
        </button>
      )}
    </div>
  );
}

export default Search;