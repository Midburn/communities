import React from 'react';
import { Col, Row } from 'mdbreact';
import { withI18n } from 'react-i18next';
import { PermissionService } from '../../services/permissions';
import * as Papa from 'papaparse';

class BaseImportGroups extends React.Component {
    permissionsService = new PermissionService();
    constructor(props) {
        super(props);
        this.checkPermissions(props);
    }

    checkPermissions(props) {
        const {match} = props;
        if (!this.permissionsService.isAllowedToManageGroups(match.params.groupType)) {
            this.permissionsService.redirectToSpark();
        }
    }

    handleFileInput = (e) => {
        if (!e.target.files || !e.target.files.length) {
            return;
        }
        const [ file ] = e.target.files;
        Papa.parse(file, {header: true, complete: this.doneParsingFile, error: this.parsingFileError })

    };

    doneParsingFile(e) {
        console.log(e)
    }

    parsingFileError(e) {
        console.warn(e);
    }

    render() {

        return (
            <div>
                <input type="file" accept=".csv" onChange={this.handleFileInput}/>
            </div>
        );
    }
}

export const ImportGroups = withI18n()(BaseImportGroups);
