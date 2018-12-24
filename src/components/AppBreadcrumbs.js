import React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'mdbreact';
import { LinkContainer } from 'react-router-bootstrap';
import { withRouter } from 'react-router-dom';
import { withI18n } from 'react-i18next';
import './AppBreadcrumbs.scss';

const BaseAppBreadcrumbs = (props) => {
    const paths = props.location.pathname.split('/').filter(p => !!p).slice(1);
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

    function getLinkPath(index) {
        let path = `/${lng}`;
        for (const i in paths) {
            const item = paths[i];
            path += `/${item}`;
            if (+i === index) {
                return path;
            }
        }
        return path;
    }


    return (
        <Breadcrumb>
            {paths.map((p, index) => {
                const isLast = index === (paths.length - 1);
                return (
                        <LinkContainer disabled={isLast} key={index} to={getLinkPath(+index)}>
                            <BreadcrumbItem active={isLast} className={`${lng === 'he' ? 'pad-left' : null}`}> { p === id ? getNameFromPath(p) : t(p) }</BreadcrumbItem >
                        </LinkContainer>
                );
            })}
        </Breadcrumb>
    );
};

export const AppBreadcrumbs = withI18n()(withRouter(props => <BaseAppBreadcrumbs {...props}/>));
