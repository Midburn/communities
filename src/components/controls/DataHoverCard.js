import React from 'react';
import {Card, CardBody} from 'mdbreact';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './DataHoverCard.scss';

export class DataHoverCard extends React.Component {
    state = {
        hovered: false
    };

    onMouseOver = () => {
        this.setState({
            hovered: true
        })
    };

    onMouseLeave = () => {
        this.setState({
            hovered: false
        });
    };

    render() {
        const {title, panel} = this.props;
        return (
            <div>
                <div onMouseOver={this.onMouseOver} onMouseLeave={this.onMouseLeave} data-hook="card-title">
                    {title}
                    <div className="HiddenCardContainer">
                        <ReactCSSTransitionGroup transitionName="example"
                                                 transitionEnterTimeout={500}
                                                 transitionLeaveTimeout={300}>
                            {this.state.hovered && !!panel ?
                                (<Card className="HiddenCard" data-hook="card-data">
                                    <CardBody>
                                        {panel}
                                    </CardBody>
                                </Card>)
                                : null}
                        </ReactCSSTransitionGroup>
                    </div>
                </div>
            </div>
        );
    }
}
