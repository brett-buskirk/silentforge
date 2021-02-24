import FormInput from './FormInput'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import './Form.css'


/* ==============================================================================================
    FORM COMPONENT
============================================================================================== */

export default class Form extends Component {

  // PROP TYPES
  static propTypes = {
    fields: PropTypes.arrayOf(PropTypes.object).isRequired,
    initialData: PropTypes.object,
    readonly: PropTypes.bool,
    id: PropTypes.string
  }


  // COLLECT ALL FORM DATA IN AN OBJECT
  getData() {
    let data = {}
    this.props.fields.forEach(field => {
      if (!field.comment) data[field.id] = this.refs[field.id].getValue()
    })
    return data
  }

  
  // RENDER THE COMPONENT
  render() {
    return (
      <form id={this.props.id} className="Form">{this.props.fields.map((field, i) => {
        const prefilled = this.props.initialData && this.props.initialData[field.id]
        if (field.comment) {
          if (field.id === 'hr') return <hr key={'hr' + i}></hr>
          return (
            <p className="FormComment" id={field.id} key={field.id}>{prefilled}</p>
          )
        }
        if (!this.props.readonly) {
          return (
            <div className="FormRow" id={'row-' + field.id} key={field.id}>
            { field.label 
                ? <label className="FormLabel" htmlFor={field.id}>{field.label}:&nbsp;</label>
                : null
            }
              <FormInput {...field} ref={field.id} defaultValue={prefilled} />
            </div>
          )
        }
        if (!prefilled) {
          return null
        }
        return (
          <div className="FormName" key={field.id}>
            <span className="FormLabel">{field.label}:&nbsp;</span>
            <div>{prefilled}</div>
          </div>
        )
      }, this)}</form>
    )
  }
}