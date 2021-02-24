import React from 'react'
import PropTypes from 'prop-types'
import ClassNames from 'classnames'
import { PageWrap, NoWorkingCharacter, Loading } from '../Utilities'
import { Armor, Gear, Weapons } from '../Equipment'
import { Button } from '../FormControls'
import { Dialog } from '../Dialog'
import update from '../../updateCharacter'
import './Equipment.css'


/* ==============================================================================================
    EQUIPMENT PAGE
============================================================================================== */

export default function Equipment(props) {

  // CHANGE THE SECTION
  const newSec = (section) => {
    props.setAppState({ equipSection: section })
  }


  // TALLY TOTAL REMAINING GOLD
  const remainingGold = (() => {
    const tally = (prev, cur) => prev = prev + (cur.qty * cur.cost)
    const totalArmor = props.selectedEquipment.armor.reduce(tally, 0)
    const totalWeapons = props.selectedEquipment.weapons.reduce(tally, 0)
    const totalGear = props.selectedEquipment.gear.reduce(tally, 0)
    const { money } = props.workingCharacter
    const totals = totalArmor + totalWeapons + totalGear
    return (money - totals).toFixed(2)
  })()


  // SET LIMIT CLASS
  const limit = ClassNames({
    money: true,
    underLimit: remainingGold >= 0,
    overLimit: remainingGold < 0
  })


  // CONFIRM PURCHASES
  const confirmPurchases = () => {
    if (remainingGold < 0) return props.setAppState({ openValidate: true })
    props.setAppState({ openConfirm: true })
  }


  // SAVE THE EQUIPMENT TO THE WORKING CHARACTER AND DATABASE
  const saveEquipment = async () => {
    // copy the working character
    let character = {...props.workingCharacter}
    const armor = Array.from(props.selectedEquipment.armor)
    const weapons = Array.from(props.selectedEquipment.weapons)
    const gear = Array.from(props.selectedEquipment.gear)

    // set the equipment to the working character
    character.armor = armor
    character.weapons = weapons
    character.equipment = gear

    // display the loading component and clear features
    props.setAppState({
      loading: true,
      loadingText: 'Updating equipment...'
    })

    // update the character
    character = await update.updateCharacter(character)

    // save the character
    props.saveCharacter(character, 'preview')
  }


  // DISMISS THE DIALOG COMPONENT AND SAVE THE CHARACTER IF APPROPRIATE
  const checkConfirmation = (action) => {
    if (action === 'dismiss') {
      props.setAppState({ 
        openConfirm: false,
        openValidate: false
      })
      return
    }
    props.setAppState({ openConfirm: false })
    saveEquipment()
  }


  // DETERMINE WHICH SECTION TO SHOW
  const equipSection = (section) => {
    // common props
    const commonProps = {
      workingCharacter: props.workingCharacter,
      selectedArmor: props.selectedEquipment.armor,
      selectedWeapons: props.selectedEquipment.weapons,
      selectedGear: props.selectedEquipment.gear,
      setAppState: props.setAppState,
      remainingGold: remainingGold,
      limit: limit
    }

    // armor props
    const armorProps = {
      armor: props.armor,
      ...commonProps
    }

    // weapon props
    const weaponProps = {
      weapons: props.weapons,
      ...commonProps
    }

    // gear props
    const gearProps = {
      gear: props.gear,
      ...commonProps
    }

    // return the correct section
    switch (section) {
      case 'armor': return <Armor {...armorProps}/>
      case 'weapons': return <Weapons {...weaponProps}/>
      case 'gear': return <Gear {...gearProps}/>
      default:
        return (
          <>
            <h2 className="equipLabel">Equipment</h2>
            <div className="equip-display main-display">
              <Button className="btn-metal btn-equip" onClick={() => newSec('weapons')}>Weapons</Button>
              <Button className="btn-metal btn-equip" onClick={() => newSec('armor')}>Armor</Button>
              <Button className="btn-metal btn-equip" onClick={() => newSec('gear')}>Gear</Button>
            </div>
            <h3 className={limit}>Gold to spend: {remainingGold}</h3>
            <Button className="btn-go btn-equip" onClick={confirmPurchases}>BUY</Button>
          </>
        )
    }
  }


  // GET SELECTED EQUIPMENT LIST FOR CONFIRMATION
  const equipmentList = (() => {
    const { armor, weapons, gear } = props.selectedEquipment
    const mapItem = (itm) => `${itm.name} (${itm.qty})`
    return (
      <>
        <p className="e-list"><span>Armor:</span> {armor.map(mapItem).join(', ') || 'None'}</p>
        <p className="e-list"><span>Weapons:</span> {weapons.map(mapItem).join(', ') || 'None'}</p>
        <p className="e-list"><span>Gear:</span> {gear.map(mapItem).join(', ') || 'None'}</p>
        <p className="e-list"><span>Remaining Gold:</span> {remainingGold}</p>
      </>
    )
  })()


  // RETURN JSX
  return (
    <PageWrap image="equipment">

      {props.loading 
          ? <Loading>{props.loadingText}</Loading>
          : null}

      <div className="equip-container">
        {props.workingCharacter._id
          ? equipSection(props.equipSection)
          : <NoWorkingCharacter msg="buy equipment" />}
      </div>

      {props.openConfirm
          ? <Dialog 
              modal={true}
              header="Confirm Equipment"
              onAction={checkConfirmation.bind(this)}>
                <div>
                  <p>You are about to change your character's equipment to the following:</p>
                  {equipmentList} 
                  <p>Is this okay?</p>
                </div>  
            </Dialog>
          : null}

        {props.openValidate
          ? <Dialog 
              modal={true}
              header="Overspent Gold"
              onAction={checkConfirmation.bind(this)}
              hasCancel={false}>
                <p>
                  You have spent too much gold. Go back and adjust your purchases until your gold is
                  in the green.
                </p>
            </Dialog>
          : null}
    </PageWrap>
  )
}


// PROP TYPES
Equipment.propTypes = {
  setAppState: PropTypes.func.isRequired,
  workingCharacter: PropTypes.object.isRequired,
  saveCharacter: PropTypes.func.isRequired,
  equipSection: PropTypes.string.isRequired,
  armor: PropTypes.arrayOf(PropTypes.object).isRequired,
  weapons: PropTypes.arrayOf(PropTypes.object).isRequired,
  gear: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedRace: PropTypes.string,
  openConfirm: PropTypes.bool,
  openValidate: PropTypes.bool,
  selectedEquipment: PropTypes.shape({
    armor: PropTypes.arrayOf(PropTypes.object),
    weapons: PropTypes.arrayOf(PropTypes.object),
    gear: PropTypes.arrayOf(PropTypes.object)
  })
}