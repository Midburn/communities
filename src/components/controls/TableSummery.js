import React from 'react';
import {Container} from 'mdbreact';
import './TableSummery.scss';
import {ExportCSV} from './ExportCSV';
import {PermissableComponent} from './PermissableComponent';

/**
 * @param sums { [title]: sum }
 * @param dataForExport - table data to be exported to CSV
 * @constructor
 */
export const TableSummery = ({sums, csvData, csvName, moreButtons}) => {

    return (
        <Container fluid className="TableSummeryContainer TableSummery d-flex justify-content-center z-depth-1">
            <Container fluid={window.innerWidth < 1200} className="TableSummery d-flex ">
                <div className="SummeryContent d-flex justify-content-between font-small align-items-center">
                    {Object.keys(sums || {}).map(key => {
                        return (
                            <div key={key}>
                                <span className="pr-1 pl-1">{key}:</span>
                                <span className="pr-1 pl-1">{sums[key]}</span>
                            </div>
                        );
                    })}
                    <div className="SummeryActions d-flex align-items-center h-100">
                        <PermissableComponent permitted={!!csvData}>
                            <ExportCSV
                                data={csvData}
                                filename={csvName}
                            />
                        </PermissableComponent>
                        {moreButtons || ' '}
                    </div>
                </div>
            </Container>
        </Container>
    );
};
