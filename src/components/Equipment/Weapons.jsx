import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '../FormControls'
import './Equipment.css'


/* ==============================================================================================
    WEAPONS SECTION COMPONENT
============================================================================================== */

export default function Weapons(props) {

  // GO BACK TO MAIN EQUIPMENT SECTION
  const back = () => props.setAppState({ equipSection: 'main' })


  // HANDLE WEAPON SELECTIONS
  const handleSelection = (e) => {
    // copy selected weapons
    const weapons = Array.from(props.selectedWeapons)

    // get input name and value
    const itemName = e.target.name
    const itemValue = e.target.value

    // set the default item to null
    let item = null

    // splice out the target item, if any
    for (let i = 0, len = weapons.length; i < len; i++) {
      if (weapons[i].name === itemName) {
        item = weapons.splice(i, 1)[0]
        break;
      }
    }

    // if the item already exists in the list, update it
    if (item) {
      item.qty = Number(itemValue)
      weapons.push(item)
    
    // otherwise add the item with a qty of 1
    } else {
      const newItem = props.weapons.filter(w => w.name === itemName)[0]
      newItem.qty = 1
      weapons.push(newItem)
    }

    // lock the changes into state
    props.setAppState({ 
      selectedEquipment: {
        armor: props.selectedArmor,
        weapons: weapons,
        gear: props.selectedGear
      }
    })
  }


  // CREATE TABLE ROWS
  const tableRows = props.weapons.map((w,i) => {
    // get existing value, if any
    const existingWeapon = props.selectedWeapons.filter(s => s.name === w.name)
    const val = existingWeapon.length ? existingWeapon[0].qty : 0
    const size = props.workingCharacter.size
    
    // return jsx
    return (
      <tr key={i}>
        <td>{w.name}</td>
        <td>{w.cost}</td>
        <td>
          {w.dmg === '-'
            ? '-'
            : size === 'Small'
              ? w.dmg.replace(/\/\d+d\d+/, '')
              : w.dmg.replace(/\dd\d+\//,'')
          }
        </td>
        <td>
          {size === 'Small'
            ? w.wt/2
            : w.wt}
        </td>
        <td>
          <input
            name={w.name}
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
      <h2 className="equipLabel">Weapons</h2>
      <table className="tbl-equip tbl-weapons">
        <thead>
          <tr>
            <th>Weapon</th>
            <th>Cost</th>
            <th>Damage</th>
            <th>Wt.</th>
            <th>Qty.</th>
          </tr>
        </thead>
      </table>
      <div className="equip-display">
        <table className="tbl-equip tbl-weapons">
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
Weapons.propTypes = {
  setAppState: PropTypes.func.isRequired,
  workingCharacter: PropTypes.object.isRequired,
  weapons: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedArmor: PropTypes.arrayOf(PropTypes.object),
  selectedWeapons: PropTypes.arrayOf(PropTypes.object),
  selectedGear: PropTypes.arrayOf(PropTypes.object),
  remainingGold: PropTypes.number,
  limit: PropTypes.object
}