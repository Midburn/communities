import React from 'react';
import { Btn, MDBIcon , MDBTooltip } from "mdbreact";

/**
 * Button interface =
 * {
 *   icon: string; (MDButton Icon names)
 *   onClick: function;
 *   tooltip?: string;
 *   color?: string;
 * }
 * @param buttons - array of buttons
 * @constructor
 */
export const ButtonGroup = ({buttons, vertical}) => {
    return (
        <div className={`d-flex ${vertical ? 'flex-column' : null}`}>
            {(buttons || []).map(button => {
                return (
                    <div onClick={button.onClick}>
                        <MDBTooltip
                            placement="left"
                            component="button"
                            componentClass="btn btn-primary"
                            tag="div"
                            color={button.color || 'primary'}
                            tooltipContent={button.tooltip}>
                            <MDBIcon icon={button.icon}></MDBIcon>
                        </MDBTooltip>
                    </div>
                )
            })}
        </div>
    )
};
