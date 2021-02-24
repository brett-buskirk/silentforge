import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'


/* ==============================================================================================
    CLASS BUTTON (Displays character classes to select from)
============================================================================================== */

export default function ClassButton({ name, image, handleClick }) {

  // SET CLASS ATTRIBUTES FOR LARGE BUTTONS
  const btnClass = classNames({
    largeButton: true,
    classButton: true,
    [image]: true
  })


  // SET CLASS ATTRIBUTES FOR SMALL BUTTONS
  const thumbClass = classNames({
    thumbnail: true,
    [image]: true
  })


  // RETURN JSX
  return (
    <>
      <div onClick={handleClick} className={btnClass}>
        <h2>{name}</h2>
      </div>
      <div onClick={handleClick} className="classButton smallButton">
        <div className={thumbClass}></div>
        <h2>{name}</h2>
      </div>
    </>
  )
}


// PROP TYPES
ClassButton.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired
}