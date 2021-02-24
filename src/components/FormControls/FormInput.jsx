import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Suggest, Select } from '../FormControls'
import './FormInput.css'


/* ==============================================================================================
    PARENT COMPONENT FOR FORM INPUT CONTROLS
============================================================================================== */

export default class FormInput extends Component {

  // PROP TYPES
  static propTypes = {
    type: PropTypes.string,
    id: PropTypes.string,
    defaultValue: PropTypes.any,
    placeholder: PropTypes.string,
    options: PropTypes.array,
    rows: PropTypes.number
  }


  // GRAB THE VALUE FROM THE REFERENCED INPUT COMPONENT/ELEMENT
  getValue() {
    return 'value' in this.refs.input
      ? this.refs.input.value
      : this.refs.input.getValue()
  }

  
  // RENDER THE COMPONENT
  render() {
    const commonProps = {
      id: this.props.id,
      ref: 'input',
      defaultValue: this.props.defaultValue,
      placeholder: this.props.placeholder
    }

    switch (this.props.type) {
      case 'year':
        return (
          <input
            {...commonProps}
            type="number"
            defaultValue={this.props.defaultValue || new Date().getFullYear()} />
        )

      case 'suggest':
        return <Suggest {...commonProps} options={this.props.options} />

      case 'select':
        return <Select {...commonProps} options={this.props.options} />

      case 'text':
        return <textarea className="TextArea" {...commonProps} rows={this.props.rows} />

      case 'number':
        return <input type="number" className="Number" {...commonProps} />

      default:
        return <input className="Text" {...commonProps} type="text" />
    }
  }
}