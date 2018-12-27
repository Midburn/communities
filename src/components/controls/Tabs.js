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
export class Tabs extends React.Component {

    render() {
        const {tabs, selectedId, onSelect, color} = this.props;
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
                <FlipMove>
                    {(tabs || []).map((tab, index) => {
                        return tab.id === selectedId ? tab.component : null
                    })}
                </FlipMove>
            </div>
        );
    }


};
