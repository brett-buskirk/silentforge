import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '../FormControls'
import './Equipment.css'


/* ==============================================================================================
    GEAR SECTION COMPONENT
============================================================================================== */

export default function Gear(props) {

  // GO BACK TO MAIN EQUIPMENT SECTION
  const back = () => props.setAppState({ equipSection: 'main' })


  // HANDLE GEAR SELECTIONS
  const handleSelection = (e) => {
    // copy selected gear
    const gear = Array.from(props.selectedGear)

    // get input name and value
    const itemName = e.target.name
    const itemValue = e.target.value

    // set the default item to null
    let item = null

    // splice out the target item, if any
    for (let i = 0, len = gear.length; i < len; i++) {
      if (gear[i].name === itemName) {
        item = gear.splice(i, 1)[0]
        break;
      }
    }

    // if the item already exists in the list, update it
    if (item) {
      item.qty = Number(itemValue)
      gear.push(item)
    
    // otherwise add the item with a qty of 1
    } else {
      const newItem = props.gear.filter(g => g.name === itemName)[0]
      newItem.qty = 1
      gear.push(newItem)
    }

    // lock the changes into state
    props.setAppState({ 
      selectedEquipment: {
        armor: props.selectedArmor,
        weapons: props.selectedWeapons,
        gear: gear
      }
    })
  }  


  // CREATE TABLE ROWS
  const tableRows = props.gear.map((g,i) => {
    // get existing value, if any
    const existingGear = props.selectedGear.filter(s => s.name === g.name)
    const val = existingGear.length ? existingGear[0].qty : 0

    // return jsx
    return (
      <tr key={i}>
        <td>{g.name}</td>
        <td>{g.cost}</td>
        <td>{g.wt}</td>
        <td>
          <input 
            name={g.name}
            className="equip-input" 
            defaultValue={val} 
            type="number" 
            min={0} 
            onChange={handleSelection}/>
        </td>
      </tr>
    )
  })
  
  // RETURN JSX
  return (
    <>
      <h2 className="equipLabel">Gear</h2>
      <table className="tbl-equip tbl-gear">
        <thead>
          <tr>
            <th>Item</th>
            <th>Cost</th>
            <th>Wt.</th>
            <th>Qty.</th>
          </tr>
        </thead>
      </table>
      <div className="equip-display">
        <table className="tbl-equip tbl-gear">
          <tbody>
            {tableRows}
          </tbody>
        </table>
      </div>
      <h3 className={props.limit}>Gold to spend: {props.remainingGold}</h3>
      <Button className="btn-metal btn-equip" onClick={() => back()}>Back</Button>
    </>
  )
}


// PROP TYPES
Gear.propTypes = {
  setAppState: PropTypes.func.isRequired,
  workingCharacter: PropTypes.object.isRequired,
  gear: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedArmor: PropTypes.arrayOf(PropTypes.object),
  selectedWeapons: PropTypes.arrayOf(PropTypes.object),
  selectedGear: PropTypes.arrayOf(PropTypes.object),
  remainingGold: PropTypes.number,
  limit: PropTypes.object
}