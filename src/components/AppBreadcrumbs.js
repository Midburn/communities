import React from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { withRouter } from 'react-router-dom';
import { withI18n } from 'react-i18next';

const BaseAppBreadcrumbs = (props) => {
    const paths = props.location.pathname.split('/').filter(p => !!p);
    const { t } = props;
    return (
        <Breadcrumb>
            <LinkContainer to="/">
                <Breadcrumb.Item >{t('home')}</Breadcrumb.Item>
            </LinkContainer>
            {paths.map((p, index) => {
                return (
                    index === paths.length - 1 ? <Breadcrumb.Item key={p} active>{t(p)}</Breadcrumb.Item> :
                    <LinkContainer key={p} to={`/${p}`}>
                        <Breadcrumb.Item>{t(p)}</Breadcrumb.Item>
                    </LinkContainer>
                );
            })}
        </Breadcrumb>
    );
};

export const AppBreadcrumbs = withI18n()(withRouter(props => <BaseAppBreadcrumbs {...props}/>));
