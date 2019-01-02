import React from 'react';
import { CSVLink } from 'react-csv';
import { Button, MDBIcon, MDBTooltip } from 'mdbreact';
import { withI18n } from 'react-i18next';

const CSV = (props) => {
    let csvLink;
    const {t, data, filename} = props;
    return (
        <div>
            <CSVLink ref={csv => csvLink = csv}
                     data={data}
                     filename={filename}
                     target="_blank">
                <MDBTooltip
                    placement={`top`}
                    component="button"
                    componentClass="btn btn-primary"
                    tag="div"
                    color={'primary'}
                    tooltipContent={t('export')}>
                    <MDBIcon size="lg" icon="file-excel-o"></MDBIcon>
                </MDBTooltip>
            </CSVLink>

        </div>

    );
};
export const ExportCSV = withI18n()(CSV);