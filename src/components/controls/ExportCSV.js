import React from 'react';
import { CSVLink } from 'react-csv';
import { MDBBtn} from 'mdbreact';
import { withI18n } from 'react-i18next';
import { TiDownload } from 'react-icons/ti'

const CSV = (props) => {
    const {t, data, filename} = props;
    return (
        <div>
            <CSVLink data={data}
                     filename={filename}
                     target="_blank">
                <MDBBtn outline color="primary" className={`d-flex align-items-center align-content-center border-blue text-blue`}>
                    <div className="w-100 h-100 d-flex align-items-center">
                        <TiDownload className="pl-1 pr-1 mr-1 ml-1" size={20}/>
                        {t('export')}
                    </div>
                </MDBBtn>
            </CSVLink>
        </div>

    );
};
export const ExportCSV = withI18n()(CSV);