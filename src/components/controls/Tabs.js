import React from "react";
import { MDBBtn } from "mdbreact";
import FlipMove from 'react-flip-move';
/**
 * tabs interface - {
 *     key: number | string;
 *     title: string;
 *     component (must contain key)
 * }
 * @param tabs - array of tabs
 * @param selectedId - string | number;
 * @constructor
 */
export const Tabs = ({tabs, selectedId, onSelect, color}) => {

    return (
        <div>
            <div className="d-flex flex-wrap">
                    {(tabs || []).map(tab => {
                        return <MDBBtn
                            key={tab.id}
                            color={color || 'primary'}
                            outline={tab.id !== selectedId}
                            onClick={() => onSelect(tab.id)}>
                            {tab.title}
                        </MDBBtn>
                    })}
            </div>
                {(tabs || []).map((tab, index) => {
                    return (
                        tab.id === selectedId ? (<div key={index}>{tab.component}</div>) : (<div key={index} />)
                    );
                })}
        </div>
    );

};
