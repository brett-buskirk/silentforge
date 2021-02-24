import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'


/* ==============================================================================================
    RACE BUTTON COMPONENT
============================================================================================== */

export default function RaceButton({ name, image, handleClick }) {

  // CLASSES FOR LARGE BUTTON
  const btnClass = classNames({
    largeButton: true,
    raceButton: true,
    [image]: true
  })


  // CLASSES FOR SMALL BUTTON
  const thumbClass = classNames({
    thumbnail: true,
    [image]: true
  })


  // RETURN THE MARKUP
  return (
    <>
      <div onClick={handleClick} className={btnClass}>
        <h2>{name}</h2>
      </div>
      <div onClick={handleClick} className="raceButton smallButton">
        <div className={thumbClass}></div>
        <h2>{name}</h2>
      </div>
    </>
  )
}


// PROP TYPES
RaceButton.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired
}