import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './Features.css'


/* ==============================================================================================
    BARD FEATURES COMPONENT
============================================================================================== */

export default function BardFeatures(props) {

  // HANDLE SELECTIONS
  const handleCheck = (e) => {
    // copy selected cantrips
    let cantrips = Array.from(props.selectedCantrips)

    // add checked cantrips to list
    if (e.target.checked) {
      cantrips.push(e.target.value)
    
    // remove unchecked cantrip from list
    } else {
      cantrips = cantrips.filter(spell => spell !== e.target.value)
    }

    // set app state
    props.setAppState({ selectedCantrips: cantrips })
  }


  // MAP THE CHECKBOX ELEMENTS
  const checkList = props.bardSpells[0].map((item, i) => {
    const checked = props.selectedCantrips.includes(item.name)
    return (
      <div className="classSpell" key={i}>
        <input
          id={item.name} 
          type="checkbox" 
          name="bardSpells[]" 
          value={item.name}
          title={item.description}
          defaultChecked={checked}
          onChange={handleCheck}/> 
        <label htmlFor={item.name} title={item.description}>{item.name}</label>
      </div>
    )
  })


  // SET CLASS NAMES
  const cls = classNames({
    underLimit: props.selectedCantrips.length <= 4,
    overLimit: props.selectedCantrips.length > 4 
  })


  // RETURN JSX
  return (
    <div className="SelectSpells">
      <div className="spellList">
      <h3>O-Level Cantrips (Pick 4)</h3>
        {checkList}
      </div>
      <p>Hover on a cantrip name to see description.</p>
      <h4 className={cls}>Spells Remaining: {4 - props.selectedCantrips.length}</h4>
    </div>
  )
}


// PROP TYPES
BardFeatures.propTypes = {
  bardSpells: PropTypes.object,
  selectedCantrips: PropTypes.arrayOf(PropTypes.string),
  setAppState: PropTypes.func
}