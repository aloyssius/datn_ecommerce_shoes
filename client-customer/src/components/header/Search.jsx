// react
import React from 'react';

// application
import { Search20Svg } from '../../svg';


function Search() {
  return (
    <div className="search">
      <div className="search__form">
        <input
          className="search__input"
          name="search"
          placeholder="Tìm kiếm sản phẩm ..."
          aria-label="Site search"
          autoComplete="off"
        />
        <button className="search__button" type="button">
          <Search20Svg />
        </button>
        <div className="search__border" />
      </div>
    </div>
  );
}

export default Search;
