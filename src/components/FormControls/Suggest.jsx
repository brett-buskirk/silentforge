import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './Suggest.css'


/* ==============================================================================================
    SUGGEST COMPONENT WITH AUTOFILL FUNCTIONALITY
============================================================================================== */

export default class Suggest extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: props.defaultValue
    }
  }


  // PROP TYPES
  static propTypes = {
    id: PropTypes.string,
    defaultValue: PropTypes.string,
    placeholder: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.number)
  }


  // RETURN THE COMPONENT'S CURRENT VALUE
  getValue() {
    return this.state.value
  }


  // RENDER THE COMPONENT
  render() {
    const randomid = Math.random().toString(16).substring(2)
    return (
      <div className="Suggest">
        <input
          list={randomid}
          defaultValue={this.props.defaultValue}
          onChange={e => this.setState({ 
            value: e.target.value
          })}
          id={this.props.id} />
        <datalist id={randomid}>{
          this.props.options.map((item, idx) => 
            <option value={item.name} key={idx}>{item.benefit}</option>
          )
        }</datalist>
      </div>
    )
  }
}