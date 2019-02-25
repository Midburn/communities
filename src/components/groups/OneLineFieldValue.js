import React from 'react';

export class OneLineFieldValue extends React.Component {

  render() {
    return (
      <div className="d-flex">
        <div className="mb-h6-responsive text-black1">{this.props.fieldName}</div>
        <p className="text-black2 font-size-14-responsive mx-2">{this.props.children}</p>
      </div>
    );
  }
}
