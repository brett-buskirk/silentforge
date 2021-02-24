import React from 'react'
import PropTypes from 'prop-types'
import './borderwrap.css'


/* ==============================================================================================
    BORDER WRAP COMPONENT
============================================================================================== */

export default function BorderWrap({ children, size, id }) {

  // RETURN JSX
  return (
    <div id ={id} className={`borderwrap ${size}`}>
      {children}
    </div>
  )
}


// PROP TYPES
BorderWrap.propTypes = {
  id: PropTypes.string,
  size: PropTypes.string,
  children: PropTypes.any
}


// DEFAULT PROPS
BorderWrap.defaultProps = {
  size: 'medium'
}