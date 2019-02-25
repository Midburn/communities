import React from 'react';

const DEFAULT_ICON_SIZE = '16px'

export class SvgIcon extends React.Component {

  iconPath = `/public/img/icons/${this.props.name}.svg`
  size = this.props.size || DEFAULT_ICON_SIZE

  render() {
    return (
      <img src={this.iconPath} alt="" width={this.size} height={this.size}/>
    )
  }
}
