import React from 'react';
import style from './NumberEditor.scss';
import {TiPlus, TiMinus} from 'react-icons/ti';
import {observer} from 'mobx-react';
import {observable} from 'mobx';

@observer class BaseNumberEditor extends React.Component {
  constructor (props) {
    super ();
    this.value = props.value;
  }
  @observable value = 0;
  WAIT_INTERVAL = 500;
  ENTER_KEY = 13;
  timer = null;

  componentWillReceiveProps (props) {
    this.value = props.value;
  }

  increment = () => {
    this.handleChange ({
      target: {value: Number (this.value) + 1},
    });
  };

  decrement = () => {
    this.handleChange ({
      target: {value: Number (this.value) - 1},
    });
  };

  handleChange = e => {
    const {onChange} = this.props;
    clearTimeout (this.timer);
    this.value = e.target.value;
    this.timer = setTimeout (() => onChange (this.value), this.WAIT_INTERVAL);
  };

  handleKeyDown = e => {
    const {onChange} = this.props;
    if (e.keyCode === this.ENTER_KEY) {
      onChange (e.target.value);
    }
  };

  render () {
    const {min, max} = this.props;
    return (
      <div className={style.NumberCounter}>
        <span
          disabled={max !== 'undefined' && this.value >= max}
          onClick={this.increment}
          id="increment"
          className="handle"
        >
          <TiPlus />
        </span>
        <input
          type="number"
          data-hook="number-input"
          value={this.value}
          onKeyDown={this.handleKeyDown}
          onChange={this.handleChange}
        />
        <span
          disabled={max !== 'undefined' && this.value <= min}
          onClick={this.decrement}
          id="decrement"
          className="handle"
        >
          <TiMinus />
        </span>
      </div>
    );
  }
}

export const NumberEditor = BaseNumberEditor;
