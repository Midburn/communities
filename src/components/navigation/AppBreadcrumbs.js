import React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'mdbreact';
import { LinkContainer } from 'react-router-bootstrap';
import { withRouter } from 'react-router-dom';
import { withI18n } from 'react-i18next';
import './AppBreadcrumbs.scss';
import { state } from '../../models/state';

const BaseAppBreadcrumbs = (props) => {
    const paths = props.location.pathname.split('/').filter(p => !!p).slice(1);
    const { t, lng, match } = props;
    const [ main, id ] = paths;

    function getNameFromPath(p) {
        if (Number(p)) {
            return state.getGroupName(+p, main);
        }
        return t(p);
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

    console.log({match, paths})
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
