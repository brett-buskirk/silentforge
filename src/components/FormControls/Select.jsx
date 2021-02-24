import React, { Component } from 'react'
import PropTypes from 'prop-types'


/* ==============================================================================================
    SELECT COMPONENT
============================================================================================== */

export default class Select extends Component {

  // PROP TYPES
  static propTypes = {
    id: PropTypes.string,
    defaultValue: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape(
      { name: PropTypes.string, _id: PropTypes.string }
    ))
  }


  // GET THE VALUE OF THE SELECTED OPTION
  getValue() {
    return this._input.value
  }


  // RENDER THE COMPONENT
  render() {
    return (
      <div className="Select">
        <select id={this.props.id} defaultValue={this.props.defaultValue} ref={(el) => this._input = el}>
          {this.props.options.map((item, idx) => 
            <option value={item._id} key={idx}>{item.name}</option>
          )}
        </select>
      </div>
    )
  }
}