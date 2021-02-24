import React from 'react'
import PropTypes from 'prop-types'
import './Features.css'


/* ==============================================================================================
    RANGER FEATURES PAGE
============================================================================================== */

export default function RangerFeatures(props) {

  // CHECK TO MAKE SURE FEAT EXISTS, OR NULL VALUE IS ENTERED
  const checkEnemy = (e) => {
    const enemies = props.enemies.map(enemy => enemy.type)
    if (enemies.includes(e.target.value) || e.target.value === '') {
      props.setEnemy(e.target.value)
    }
  }
  

  // ASSIGN RANDOM ID TO CONNECT INPUT AND DATALIST ELEMENTS
  const randomid = Math.random().toString(16).substring(2)


  // MAP THE OPTION ELEMENTS
  const optionList = props.enemies.map((item, i) => {
    return <option className="enemyOption" value={item.type} key={i}>example: {item.example}</option>
  })


  // RETURN JSX
  return (
    <div className="SelectEnemy">
      <label htmlFor={props.id}>Favored Enemy: </label>
      <input
        id={props.id}
        list={randomid}
        placeholder="Favored Enemy..."
        defaultValue={props.defaultValue}
        onChange={e => checkEnemy(e)}
        />
      <datalist id={randomid}>{optionList}</datalist>
      <p>
        A ranger may select a type of creature from the select box above. Due to thier extensive study
        of this chosen type of foe and training in the proper techniques for combating such creatures, 
        the ranger gains a +2 bonus on Bluff, Listen, Sense Motive, Spot, and Survival checks when using 
        these skills against creatures of this type. Likewise, rangers get a +2 bonus on weapon damage rolls 
        against such creatures.
      </p>
    </div>
  )
}


// PROP TYPES
RangerFeatures.propTypes = {
  enemies: PropTypes.arrayOf(PropTypes.object).isRequired,
  id: PropTypes.string,
  defaultValue: PropTypes.string,
  setEnemy: PropTypes.func
}