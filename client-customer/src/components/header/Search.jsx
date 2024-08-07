// react
import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
// application
import { Search20Svg } from '../../svg';
import { PATH_PAGE } from '../../routes/path';

function Search() {

  const [search, setSearch] = useState("");

  const history = useHistory();
  const location = useLocation();

  const handleSearch = () => {
    history.push(`${PATH_PAGE.product.product_list}?search=${search?.trim()}`)
  }

  useEffect(() => {
    if (location.pathname !== PATH_PAGE.product.product_list) {
      setSearch("");
    }
  }, [location.pathname])

  return (
    <div className="search">
      <div className="search__form">
        <input
          className="search__input"
          name="search"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          placeholder="Tìm kiếm sản phẩm ..."
          aria-label="Site search"
          autoComplete="off"
        />
        <button className="search__button" onClick={handleSearch} type="button">
          <Search20Svg />
        </button>
        <div className="search__border" />
      </div>
    </div>
  );
}

export default Search;
