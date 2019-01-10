import React from 'react';
import {Container, Table, TableBody} from 'mdbreact';
import './TableSummery.scss';
import {ExportCSV} from './ExportCSV';
import {PermissableComponent} from './PermissableComponent';

/**
 * @param sums { [title]: sum }
 * @param dataForExport - table data to be exported to CSV
 * @constructor
 */
export const TableSummery = ({sums, csvData, csvName}) => {

    return (
        <Container fluid className="TableSummeryContainer TableSummery d-flex justify-content-center z-depth-1">
            <Container fluid={window.innerWidth < 1200} className="TableSummery d-flex ">
                <div className="SummeryContent pt-4 pb-4 d-flex justify-content-between font-small align-items-center">
                    <Table responsive borderless>
                        <TableBody>
                            <tr>
                                {Object.keys(sums || {}).map(key => {
                                    return (
                                        <td key={key}>
                                            <span className="pr-1 pl-1">{key}:</span>
                                            <span className="pr-1 pl-1">{sums[key]}</span>
                                        </td>
                                    );
                                })}
                            </tr>

                        </TableBody>
                    </Table>

                    <div className="SummeryActions">
                        <PermissableComponent permitted={!!csvData}>
                            <ExportCSV
                                data={csvData}
                                filename={csvName}
                            />
                        </PermissableComponent>
                    </div>
                </div>
            </Container>
        </Container>
    );
};
