import React, { Component } from 'react';
import {
    Button,
    Col,
    ControlLabel,
    FormControl,
    FormGroup,
    Grid,
    HelpBlock,
    PageHeader,
    Panel, ProgressBar,
    Row
} from 'react-bootstrap';
import './Login.scss';
import { withI18n } from 'react-i18next';
import Flag from 'react-flags';
import i18n from '../services/i18n';
import { AuthService } from '../services/auth';
import { withRouter } from 'react-router-dom';

export class BaseLogin extends Component {

    authService = new AuthService();

    state = {
        email: '',
        password: '',
        err: null,
        message: '',
        loading: false
    };

    updateEmail = (e) => {
        this.setState({
            email: e.target.value
        });
    };

    updatePassword = (e) => {
        this.setState({
            password: e.target.value
        });
    };

    changLng = (lng) => {
        i18n.changeLanguage(lng);
    };

    login = async () => {
        const { t } = this.props;
        const { email, password } = this.state;
        this.setState({ message: '', loading: true });
        try {
            const res = await this.authService.login({ email, password });
            this.setState({ loading: false });
            if (res.status === 200) {
                /**
                 * Login success
                 */
                this.props.history.push('/');
            }
        } catch (err) {
            this.setState({ message: t('loginError'), loading: false });
            this.setState({ err });
        }
    };

    isFormValid = () => {
        return this.state.email.length > 0 && this.state.password.length > 0;
    };

    render() {
        const { t } = this.props;
        return (
            <div className="login-container">
                <Grid className="Login">
                    <Row>
                        <Col xs={4} />
                        <Col xs={4} className="content">
                            <Panel>
                                <PageHeader>{t('login')}</PageHeader>
                                <form>
                                    <FormGroup controlId="login">
                                        <ControlLabel>{t('email')}</ControlLabel>
                                        <FormControl
                                            type="email"
                                            value={this.state.email}
                                            disabled={this.state.loading}
                                            placeholder={t('email')}
                                            onChange={this.updateEmail}
                                        />
                                        <FormControl.Feedback />
                                    </FormGroup>
                                    <FormGroup controlId="password">
                                        <ControlLabel>{t('password')}</ControlLabel>
                                        <FormControl
                                            type="password"
                                            disabled={this.state.loading}
                                            value={this.state.password}
                                            placeholder={t('password')}
                                            onChange={this.updatePassword}
                                        />
                                        <FormControl.Feedback />
                                    </FormGroup>
                                    <Button disabled={this.state.loading || !this.isFormValid()} bsStyle="info" onClick={this.login}>{t('login')}</Button>
                                    <HelpBlock>
                                        {this.state.loading ? <ProgressBar active now={100} />: null}
                                        {this.state.message}
                                    </HelpBlock>
                                </form>
                                <div className="lng-changer">
                                    <div className="clickable" onClick={() => this.changLng('en')}>
                                        <Flag
                                            name="US"
                                            format="png"
                                            pngSize={32}
                                            basePath="img/flags"
                                            shiny={true}
                                        />
                                    </div>
                                    <div className="clickable" onClick={() => this.changLng('he')}>
                                        <Flag
                                            name="IL"
                                            format="png"
                                            pngSize={32}
                                            basePath="img/flags"
                                            shiny={true}
                                        />
                                    </div>
                                </div>
                            </Panel>
                        </Col>
                        <Col xs={4} />
                    </Row>
                </Grid>
            </div>
        )
    }
}

export const Login = withRouter(withI18n()(BaseLogin));