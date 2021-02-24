import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import './Button.css'


/* ==============================================================================================
    BASIC BUTTON COMPONENT
============================================================================================== */

export default function Button(props) {

  // SET CLASS NAMES
  const btnClass = classNames({
    Button: true,
    btnDefault: !props.className,
    [props.className]: props.className
  })


  // RETURN JSX
  return  <button {...props} className={btnClass}>{props.children}</button>
}


// PROP TYPES
Button.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.any
}