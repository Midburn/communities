import React from 'react';
import { ControlLabel, FormControl, FormGroup, Table } from 'react-bootstrap';
import { CampsService } from '../services/camps';
import { withI18n } from 'react-i18next';

class BaseCamps extends React.Component {

  campService = new CampsService();

  state = {
      searchQuery: '',
      camps: []
  };

  handleChange = (e) => {
      this.setState({
          searchQuery: e.target.value
      });
  };

  async getCamps() {
    if (this.state.searchQuery.length < 3) {
      return;
    }
    const camps = await this.campService.searchCamps(this.state.searchQuery);
    this.setState({ camps });
  }

  render() {
    const { t } = this.props;
    return (
        <div>
            <form>
                <FormGroup
                    controlId="searchCampsForm">
                    <ControlLabel>{t('search_camps')}</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.searchQuery}
                        onChange={this.handleChange}
                    />
                    <FormControl.Feedback />
                </FormGroup>
            </form>
            <Table responsive>

            </Table>
        </div>

    );
  }
};
export const Camps = withI18n()(BaseCamps);