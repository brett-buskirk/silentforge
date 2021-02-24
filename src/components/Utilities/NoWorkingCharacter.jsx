import React from 'react'
import PropTypes from 'prop-types'
import './NoWorkingCharacter.css'


/* ==============================================================================================
    NO WORKING CHARACTER DISPLAY COMPONENT
============================================================================================== */

export default function NoWorkingCharacter({ msg }) {

  // RETURN JSX
  return (
    <div className="noWorkingCharacter">
      <h1>No Working Character!</h1>
      <h3>You must have a working character to {msg}.</h3>
      <br/>
      <h3>To create a working character, go to the First page.</h3>
    </div>
  )
}


// PROP TYPES
NoWorkingCharacter.propTypes = {
  msg: PropTypes.string.isRequired
}