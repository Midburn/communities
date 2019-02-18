import React from 'react';
import {PermissionService} from '../../services/permissions';
import * as Papa from 'papaparse';
import {Row, Col, MDBBtn} from 'mdbreact';
import {GroupsService} from '../../services/groups';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import {state} from '../../models/state';
import {ParsingService} from '../../services/parsing';
@observer class BaseImportGroups extends React.Component {
  permissionsService = new PermissionService ();
  groupService = new GroupsService ();
  parsingService = new ParsingService ();
  @observable loading = false;
  @observable done = false;
  @observable error;
  @observable results;
  state = {
    importData: null,
  };

  constructor (props) {
    super (props);
    this.checkPermissions (props);
  }

  checkPermissions (props) {
    const {match} = props;
    if (
      !this.permissionsService.isAllowedToManageGroups (match.params.groupType)
    ) {
      this.permissionsService.redirectToSpark ();
    }
  }

  handleFileInput = e => {
    if (!e.target.files || !e.target.files.length) {
      return;
    }
    const [file] = e.target.files;
    Papa.parse (file, {
      dynamicTyping: true,
      encoding: 'utf-8',
      complete: this.doneParsingFile,
      error: this.parsingFileError,
    });
  };

  doneParsingFile = e => {
    const headers = e.data[0];
    e.data.shift ();
    const groups = [];
    for (const csvGroup of e.data) {
      const group = {};
      for (let i = 0; i <= headers.length; i++) {
        const header = headers[i];
        if (header) {
          group[header.trim ()] = csvGroup[i];
        }
      }
      groups.push (group);
    }
    this.setState ({done: false, importData: groups.map (this.parseGroup)});
  };

  parseGroup = group => {
    const {match} = this.props;
    /**
     * Perform group data parsing here.
     */
    group.event_id = state.currentEventId;
    group.group_type = this.parsingService.getGroupTypeFromString (
      match.params.groupType
    );
      /**
       * Parse text to boolean
       */
    Object.keys(group).forEach(key => {
      if (group[key] && group[key].trim)
      switch (group[key.trim()]) {
          case 'yes':
          case 'כן':
            group[key] = true;
            break;
          case 'no':
          case 'לא':
          case 'עודלאיודעים':
            group[key] = false;
            break;
          default:
            break;
      }
    });
    delete group.group_comments;
    group.group_desc_en = group.group_desc_he = group.group_content;
    group.child_friendly = !group.over_18;
    return group;
  };

  performImport = async () => {
    this.loading = true;
    try {
      this.results = await this.groupService.createGroups (
        this.state.importData
      );
      console.log (this.results);
      this.loading = false;
      this.done = true;
    } catch (e) {
      this.loading = false;
      this.error = e;
    }
  };

  parsingFileError (e) {
    console.warn (e);
  }

  get isButtonDisabled () {
    return (
      !this.state.importData ||
      !this.state.importData.length ||
      this.state.loading ||
      this.error
    );
  }

  render () {
    const Results = (
      <div>
        <h1>בוצע בהצלחה!</h1>
        {this.results &&
          <div>
            <h2>הצלחות</h2>
            <span>{this.results.success.length} הצלחות </span>
            <h2>
              כשלונות (בדוק האם קיימים אימוג'ים או סמלים לא חוקיים בנתוני המחנות הנ"ל)
            </h2>
            <ul>
              {this.results.failures.map ((name, i) => <li key={i}>{name}</li>)}
            </ul>
            <h2>אנשי קשר ראשיים ללא מיילים</h2>
            <ul>
              {this.results.failedEmails.map ((name, i) => (
                <li key={i}>{name}</li>
              ))}
            </ul>
            <h2>קאמפים בעלי שם זהה בDB</h2>
            <ul>
              {this.results.existing.map ((name, i) => <li key={i}>{name}</li>)}
            </ul>
          </div>}
      </div>
    );
    return (
      <div>

        {this.done
          ? Results
          : <Row>
              <Col md="6">
                <input
                  type="file"
                  accept=".csv"
                  onChange={this.handleFileInput}
                />
              </Col>
              <Col md="6">
                <MDBBtn
                  className={'border-blue text-blue'}
                  outline
                  color="primary"
                  disabled={this.isButtonDisabled}
                  onClick={this.performImport}
                >
                  {this.loading ? <span>טוען...</span> : <span>בצע</span>}
                </MDBBtn>
                {this.state.e
                  ? <span>
                      קרתה תקלה! - {this.e.stack}
                    </span>
                  : null}
              </Col>
            </Row>}
      </div>
    );
  }
}

export const ImportGroups = BaseImportGroups;
