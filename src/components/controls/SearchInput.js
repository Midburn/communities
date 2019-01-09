import React from 'react';
import { IoMdSearch } from 'react-icons/io';
import './SearchInput.scss';

export const SearchInput = ({placeholder}) => {
    return (
        <div className="SearchInput">
            <IoMdSearch color="gray"/>
            <input placeholder={placeholder}/>
        </div>
    )
}