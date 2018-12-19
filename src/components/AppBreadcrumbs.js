import React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'mdbreact';
import { LinkContainer } from 'react-router-bootstrap';
import { withRouter } from 'react-router-dom';
import { withI18n } from 'react-i18next';

const BaseAppBreadcrumbs = (props) => {
    const paths = props.location.pathname.split('/').filter(p => !!p);
    const { t, lng } = props;

    return (
        <Breadcrumb light color="white">
            <LinkContainer to="/">
                <BreadcrumbItem >{t('home')}</BreadcrumbItem >
            </LinkContainer>
            {paths.map((p, index) => {
                return (
                    index === paths.length ? <BreadcrumbItem  key={p} active>{t(p)}</BreadcrumbItem > :
                        <LinkContainer key={p} to={`/${p}`}>
                            <BreadcrumbItem > {t(p)}</BreadcrumbItem >
                        </LinkContainer>
                );
            })}
        </Breadcrumb>
    );
};

export const AppBreadcrumbs = withI18n()(withRouter(props => <BaseAppBreadcrumbs {...props}/>));
