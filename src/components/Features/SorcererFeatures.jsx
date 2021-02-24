import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './Features.css'


/* ==============================================================================================
    SORCERER FEATURES COMPONENT
============================================================================================== */

export default function SorcererFeatures(props) {

  // HANDLE SELECTIONS
  const handleCheck = (e) => {
    // get the level of the spell
    const level = Number(e.target.id.substr(1,1))

    // copy the selected cantrips and spells
    let spells = Array.from(props.selectedSpells)
    let cantrips = Array.from(props.selectedCantrips)

    // set checked cantrips or spells
    if (e.target.checked) {
      if (level === 0) {
        cantrips.push(e.target.value)
      } else {
        spells.push(e.target.value)
      }

    // unset unchecked cantrips or spells
    } else {
      cantrips = cantrips.filter(cantrip => cantrip !== e.target.value)
      spells = spells.filter(spell => spell !== e.target.value)
    }

    // set app state
    props.setAppState({ 
      selectedCantrips: cantrips,
      selectedSpells: spells 
    })
  }


  // MAP THE OPTION ELEMENTS
  const optionList = (level) => props.sorcererSpells[level].map((item, i) => {
    // determine whether or not cantrip/spell is already checked
    const checked = level === 0 
      ? props.selectedCantrips.includes(item.name)
      : props.selectedSpells.includes(item.name)
    
    // RETURN JSX
    return (
      <div className="classSpell" key={i}>
        <input
          id={`_${level}-${item.name}`} 
          type="checkbox" 
          name="sorcererSpells[]" 
          value={item.name}
          title={item.description}
          defaultChecked={checked}
          onChange={handleCheck}/> 
        <label htmlFor={item.name} title={item.description}>{item.name}</label>
      </div>
    )
  })

  
  // CANTRIP CLASS VARIABLES
  const clsCantrip = classNames({
    underLimit: props.selectedCantrips.length <= 4,
    overLimit: props.selectedCantrips.length > 4 
  })


  // SPELL CLASS VARIABLES
  const clsSpell = classNames({
    underLimit: props.selectedSpells.length <= 2,
    overLimit: props.selectedSpells.length > 2 
  })


  // RETURN JSX
  return (
    <div className="SelectSpells">
      <div className="spellList">
        <h3>0-Level Cantrips (pick 4)</h3>
        {optionList(0)}
        <br/><hr/>
        <h3>1st-Level Spells (pick 2)</h3>
        {optionList(1)}
      </div>
      <p>Hover on cantrip/spell name to see description.</p>
      <h4>Remaining: 
        {' '}
        <span className={clsCantrip}>Cantrips: {4 - props.selectedCantrips.length}</span>
        {' '}
        <span className={clsSpell}>Spells: {2 - props.selectedSpells.length}</span>
      </h4>
    </div>
  )
}


// PROP TYPES
SorcererFeatures.propTypes = {
  sorcererSpells: PropTypes.object,
  selectedSpells: PropTypes.arrayOf(PropTypes.string),
  selectedCantrips: PropTypes.arrayOf(PropTypes.string),
  setAppState: PropTypes.func
}