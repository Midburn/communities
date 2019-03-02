import React from 'react';
import {withI18n} from 'react-i18next';
import {Table, TableHead, TableBody, MDBTooltip} from 'mdbreact';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import {Loader} from '../../Loader';
import {IconInput} from '../../controls/IconInput';
import { Col, Row, Button } from 'mdbreact';
import { RequestsService } from '../../../services/requests';
import {state} from '../../../models/state';
import * as constatns from '../../../../models/constants';

@observer class BaseGroupRequestManagement extends React.Component {

  requestsService = new RequestsService();
  @observable email;

  sendRequest = () => {
    const {group} = this.props;
    const request = {
      created_by_id: state.loggedUser.user_id,
      related_id: group.id,
      related_type: group.group_type,
      data: {
        request_type: constatns.REQUEST_TYPES.ADMIN_JOIN_REQUEST,
        request_status: constatns.REQUEST_STATUSES.PENDING,
        email: this.email,
      }
    };
    this.requestsService.addRequest(request);
  };

  render () {
    const {t, requests, isLoading} = this.props;
    if (isLoading) {
      return <Loader />;
    }
    const NoReqests = (
        <div className="pt-5">
          <div className="text-center">
            אין לך בקשות ממתינות לטיפול 🤔
          </div>
          <div className="text-center">
            ניתן לשלוח בקשות על פי פרופיל מידברן ולעקוב אחרי הסטטוס שלהם לאחר השליחה
          </div>
        </div>
    );
    return (
      <div>
        <Row className="mt-4 mb-4">
          <Col md="8">
          </Col>
          <Col md="4" className="d-flex">
            <IconInput
                icon={<i className="eva eva-person-add-outline"/>}
                value={this.email}
                placeholder={t (`members.add`)}
            />
            <Button disabled={this.loading} color="primary" onClick={this.sendRequest}>{t('send_request')}</Button>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Table responsive btn>
              <TableHead>
                <tr>
                  <th>{t('name')}</th>
                  <th>{t('email')}</th>
                  <th>{t('phone')}</th>
                  <th>{t('last_update')}</th>
                  <th>{t('request_status')}</th>
                </tr>
              </TableHead>
              <TableBody>
                {(requests || []).map (request => {
                  return (
                      <tr key={request.id}>
                        <td>faet</td>
                      </tr>
                  );
                })}
              </TableBody>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            {(!requests || !requests.length) && NoReqests}
          </Col>
        </Row>
      </div>
    );
  }
}

export const GroupRequestManagement = withI18n () (BaseGroupRequestManagement);
