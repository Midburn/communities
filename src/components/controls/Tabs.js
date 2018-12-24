import React from "react";
import { MDBBtn, Collapse } from "mdbreact";
import FlipMove from 'react-flip-move';

/**
 * tabs interface - {
 *     id: number | string;
 *     title: string;
 *     component
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
                            color={color || 'primary'}
                            outline={tab.id !== selectedId}
                            onClick={() => onSelect(tab.id)}>
                            {tab.title}
                        </MDBBtn>
                    })}
            </div>
            <div className="Content">
                <FlipMove>
                    {(tabs || []).map(tab => {
                        return tab.id === selectedId ? tab.component : null
                    })}
                </FlipMove>
            </div>
        </div>
    );

};
