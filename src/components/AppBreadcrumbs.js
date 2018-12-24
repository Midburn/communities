import React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'mdbreact';
import { LinkContainer } from 'react-router-bootstrap';
import { withRouter } from 'react-router-dom';
import { withI18n } from 'react-i18next';
import './AppBreadcrumbs.scss';

const BaseAppBreadcrumbs = (props) => {
    const paths = props.location.pathname.split('/').filter(p => !!p);
    const { t, lng, match } = props;
    const [ main, id ] = paths;

    function getNameFromPath(path) {
        switch (main) {
            case 'camps':
                // TODO - get names service
            case 'arts':
                // TODO - get names service
            default:
                return path;
        }
    }

    return (
        <Breadcrumb>
            <LinkContainer to="/">
                <BreadcrumbItem active={"false"}>{t('home')}</BreadcrumbItem >
            </LinkContainer>
            {paths.map((p, index) => {
                return (
                    index === paths.length - 1 ? <BreadcrumbItem className={`${lng === 'he' ? 'pad-left' : null}`}  key={p} active>{ p === id ? getNameFromPath(p) : t(p) }</BreadcrumbItem > :
                        <LinkContainer key={p} to={`/${p}`}>
                            <BreadcrumbItem className={`${lng === 'he' ? 'pad-left' : null}`} active={false}> { p === id ? getNameFromPath(p) : t(p) }</BreadcrumbItem >
                        </LinkContainer>
                );
            })}
        </Breadcrumb>
    );
};

export const AppBreadcrumbs = withI18n()(withRouter(props => <BaseAppBreadcrumbs {...props}/>));
