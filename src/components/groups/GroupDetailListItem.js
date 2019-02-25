import React from 'react';

export class GroupDetailListItem extends React.Component {

  render () {
    return (
      <li>
        <div className="item-icon">{this.props.icon}</div>
        <div className="item-text">{this.props.text}</div>
      </li>
    )
  }
}
