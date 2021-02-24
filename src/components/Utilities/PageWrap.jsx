import React from 'react'
import PropTypes from 'prop-types'
import './pagewrap.css'


/* ==============================================================================================
    PAGE WRAP COMPONENT
============================================================================================== */

export default function PageWrap({ image, children }) {

  // RETURN JSX
  return (
    <div className={"pagewrap " + image}>
      {children}
    </div>
  )
}


// PROP TYPES
PageWrap.propTypes = {
  image: PropTypes.string,
  children: PropTypes.any
}