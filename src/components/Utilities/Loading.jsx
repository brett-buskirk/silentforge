import React from 'react'
import PropTypes from 'prop-types'
import './Loading.css'


/* ==============================================================================================
    LOADING COMPONENT
============================================================================================== */

export default function Loading({ children="Retrieving data..." }) {

  // RETURN JSX
  return (
    <div className="loadingMain">
      <div className="loadingIcon"></div>
      <div className="loadingBody">
        <h2>{children}</h2>
        <div className="loadingGif"></div>
      </div>
    </div>
  )
}


// PROP TYPES
Loading.propTypes = {
  children: PropTypes.string
}