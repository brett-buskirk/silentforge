import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'


/* ==============================================================================================
    SIDE NAV COMPONENT
============================================================================================== */

export default function SideNav({ id, click, page, children }) {

  // SET CLASS ATTRIBUTES
  const navClass = classNames({
    navItem: true,
    currentPage: (page === id)
  })


  // RETURN MARKUP
  return (
    <li>
      <p className="hex">
        &#9108;&nbsp;
      </p>
      <p className={navClass} id={id} onClick={click} >
        {children}
      </p>
    </li>
  )
}


// PROP TYPES
SideNav.propTypes = {
  id: PropTypes.string.isRequired,
  click: PropTypes.func.isRequired,
  page: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired
}