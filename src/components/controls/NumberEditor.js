import React from 'react';
import style from './NumberEditor.scss';
import {TiPlus, TiMinus} from 'react-icons/ti'

export class NumberEditor extends React.Component {
    constructor(props) {
        super();
        this.state = {
            value: props.value
        };
    }
    WAIT_INTERVAL = 1000;
    ENTER_KEY = 13;
    timer = null;

    componentWillReceiveProps(props) {
        this.setState({
            value: props.value
        })
    }
    handleChange = (e) => {
        const {onChange} = this.props;
        clearTimeout(this.timer);
        this.setState({ value: e });
        this.timer = setTimeout(() => onChange(e), this.WAIT_INTERVAL);
    };

    handleKeyDown = (e) => {
        const {onChange} = this.props;
        if (e.keyCode === this.ENTER_KEY) {
            onChange(e)
        }
    };

    render() {
        const {onChange, min, max} = this.props;
        return (
            <div className={style.NumberCounter}>
            <span disabled={max !== 'undefined' && this.state.value >= max} onClick={() => onChange(Number(this.state.value) + 1)} id="increment" className="handle">
                <TiPlus />
            </span>
                <input type="number" data-hook="number-input" value={this.state.value || 0}
                       onKeyDown={(e) => this.handleKeyDown(Number(e.target.value))}
                       onChange={(e) => this.handleChange(Number(e.target.value))}/>
                <span disabled={max !== 'undefined' && this.state.value <= min} onClick={() => onChange(Number(this.state.value) - 1)} id="decrement" className="handle">
                <TiMinus />
            </span>
            </div>
        );
    }

};