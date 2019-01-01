import React from 'react';
import { MDBIcon , MDBTooltip } from "mdbreact";
import { withI18n } from 'react-i18next';

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
const BaseButtonGroup = ({buttons, vertical, lng, context}) => {
    return (
        <div className={`d-flex ${vertical ? 'flex-column' : null}`}>
            {(buttons || []).map((button, i) => {
                return (
                    <div key={i} onClick={(e) => button.onClick(e, context)}>
                        <MDBTooltip
                            placement={`${lng === 'he' ? 'right' : 'left'}`}
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
export const ButtonGroup = withI18n()(BaseButtonGroup);