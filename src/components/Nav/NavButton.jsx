import React from 'react'
import PropTypes from 'prop-types'
import './NavButton.css'


/* ==============================================================================================
    NAV BUTTON TO HIDE/SHOW NAVBAR
============================================================================================== */

export default function NavButton({ changeNav }) {

  // RETURN JSX
  return (
    <div className="nav-btn">
      <input type="checkbox" className="nav-checkbox" id="navi-toggle"></input>
      <label htmlFor="navi-toggle" className="nav-button" onClick={() => changeNav()}>
        <span className="nav-icon">&nbsp;</span>
      </label>
    </div>
  )
}


// PROP TYPES
NavButton.propTypes = {
  changeNav: PropTypes.func.isRequired
}