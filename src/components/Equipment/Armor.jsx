import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '../FormControls'
import './Equipment.css'


/* ==============================================================================================
    ARMOR SECTION COMPONENT
============================================================================================== */

export default function Armor(props) {

  // GO BACK TO MAIN EQUIPMENT SECTION
  const back = () => props.setAppState({ equipSection: 'main' })


  // HANDLE ARMOR SELECTIONS
  const handleSelection = (e) => {
    // copy selected armor
    const armor = Array.from(props.selectedArmor)

    // get input name and value
    const itemName = e.target.name
    const itemValue = e.target.value

    // set the default item to null
    let item = null

    // splice out the target item, if any
    for (let i = 0, len = armor.length; i < len; i++) {
      if (armor[i].name === itemName) {
        item = armor.splice(i, 1)[0]
        break;
      }
    }

    // if the item already exists in the list, update it
    if (item) {
      item.qty = Number(itemValue)
      armor.push(item)
    
    // otherwise add the item with a qty of 1
    } else {
      const newItem = props.armor.filter(a => a.name === itemName)[0]
      newItem.qty = 1
      armor.push(newItem)
    }

    // lock the changes into state
    props.setAppState({ 
      selectedEquipment: {
        armor: armor,
        weapons: props.selectedWeapons,
        gear: props.selectedGear
      }
    })
  }


  // CREATE TABLE ROWS
  const tableRows = props.armor.map((a,i) => {
    // get existing value, if any
    const existingArmor = props.selectedArmor.filter(s => s.name === a.name)
    const val = existingArmor.length ? existingArmor[0].qty : 0
    const size = props.workingCharacter.size

    // return jsx
    return (
      <tr key={i}>
        <td>{a.name}</td>
        <td>{a.cost}</td>
        <td>{a.bonus}</td>
        <td>
          {size === 'Small'
            ? a.wt/2
            : a.wt}
        </td>
        <td>
          <input
            name={a.name} 
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
      <h2 className="equipLabel">Armor</h2>
      <table className="tbl-equip tbl-armor">
        <thead>
          <tr>
            <th>Armor</th>
            <th>Cost</th>
            <th>Bonus</th>
            <th>Wt.</th>
            <th>Qty.</th>
          </tr>
        </thead>
      </table>
      <div className="equip-display">
        <table className="tbl-equip tbl-armor">
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
Armor.propTypes = {
  setAppState: PropTypes.func.isRequired,
  workingCharacter: PropTypes.object.isRequired,
  armor: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedArmor: PropTypes.arrayOf(PropTypes.object),
  selectedWeapons: PropTypes.arrayOf(PropTypes.object),
  selectedGear: PropTypes.arrayOf(PropTypes.object),
  remainingGold: PropTypes.number,
  limit: PropTypes.object
}