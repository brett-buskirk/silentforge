import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { PageWrap, NoWorkingCharacter } from '../Utilities'
import { Button } from '../FormControls'
import DND from '../../D&D'
import './Preview.css'


/* ==============================================================================================
    PREVIEW PAGE
============================================================================================== */

export default class Preview extends Component {

  // PROP TYPES
  static propTypes = {
    setAppState: PropTypes.func.isRequired,
    workingCharacter: PropTypes.object.isRequired,
    saveCharacter: PropTypes.func.isRequired,
    selectedRace: PropTypes.string,
    openConfirm: PropTypes.bool,
    openValidate: PropTypes.bool,
  }


  // GET A STRING OF ALL THE CHARACTER'S CALCULATED ABILITY SCORES
  getAbilityScores() {
    const { str, dex, con, int, wis, cha } = this.props.workingCharacter.abilities
    let abils = ''
    abils += `Str ${DND.getTotalAbilityScore(str)}, `
    abils += `Dex ${DND.getTotalAbilityScore(dex)}, `
    abils += `Con ${DND.getTotalAbilityScore(con)}, `
    abils += `Int ${DND.getTotalAbilityScore(int)}, `
    abils += `Wis ${DND.getTotalAbilityScore(wis)}, `
    abils += `Cha ${DND.getTotalAbilityScore(cha)}`
    return abils
  }


  // GET A STRING OF ALL THE CHARACTER'S CALCULATED SAVING THROWS
  getSavingThrows() {
    const { fort, ref, will } = this.props.workingCharacter.saves
    const f = DND.getTotalSaves(fort)
    const r = DND.getTotalSaves(ref)
    const w = DND.getTotalSaves(will)
    let saves = ''
    // Set positive or negative
    saves += `Fort ${f >= 0 ? '+' : ''}${f}, `
    saves += `Ref ${r >= 0 ? '+' : ''}${r}, `
    saves += `Will ${w >= 0 ? '+' : ''}${w}`
    return saves
  }


  // GET CLASS FEATURES, REMOVING bf_ PREFIX FROM BONUS FEATS
  getClassFeatures() {
    const { classFeatures } = this.props.workingCharacter
    const list = classFeatures.map(feature => feature.replace('bf_', ''))
    return list.join(', ')
  }


  // GET RACE FEATURES
  getRaceFeatures() {
    const { raceFeatures } = this.props.workingCharacter
    return raceFeatures.join(', ')
  }


  // GET FEATS, ADDING IN SPECIFIC FOCUSES FOR THE RELEVANT FEATS
  getFeats() {
    const { feats } = this.props.workingCharacter
    return feats.map(feat => feat.name + (feat.focus ? ` (${feat.focus})`: '')).join(', ')
  }


  // GET SKILLS, RETURNED AS A STRING WITH RANK VALUES
  getSkills() {
    const { skills, abilities } = this.props.workingCharacter
    return skills.map(skill => {
      const name = skill.name
      const abil = DND.getTotalAbilityScore(abilities[skill.abil])
      const mod = DND.calculateAbilityModifier(abil)
      const total = skill.ranks + skill.race + skill.feat + skill.class + mod
      return `${name}: ${total > 0 ? `+${total}` : total}`
    })
    .join(', ')
  }


  // GET SELECTED EQUIPMENT LIST
  equipmentList(type) {
    const { armor, weapons, equipment } = this.props.workingCharacter
    const mapItem = (itm) => `${itm.name} (${itm.qty})`
    switch (type) {
      case 'armor': return armor.map(mapItem).join(', ') || 'None'
      case 'weapons': return weapons.map(mapItem).join(', ') || 'None'
      default: return equipment.map(mapItem).join(', ') || 'None'
    }
  }


  // RENDER THE COMPONENT
  render() {
    const wc = this.props.workingCharacter
    return (
        <PageWrap image="preview">
          <div className="previewMain">
            {wc._id
              ? <table>
                  <tbody>
                    <tr>
                      <th>Name:</th>
                      <td>{wc.name}</td>
                    </tr>
                    <tr>
                      <th>Class:</th>
                      <td>{wc.class ? wc.class[0].toUpperCase() + wc.class.slice(1) : null}</td>
                    </tr>
                    <tr>
                      <th>Race:</th>
                      <td>{wc.race ? wc.race[0].toUpperCase() + wc.race.slice(1) : null}</td>
                    </tr>
                    <tr>
                      <th>Gender:</th>
                      <td>{wc.details.gender}</td>
                    </tr>
                    <tr>
                      <th>Size:</th>
                      <td>{wc.size}</td>
                    </tr>
                    <tr>
                      <th>Alignment:</th>
                      <td>{wc.details.alignment}</td>
                    </tr>
                    <tr>
                      <th>Deity:</th>
                      <td>{wc.details.deity}</td>
                    </tr>
                    <tr>
                      <th>Abilities:</th>
                      <td>{this.getAbilityScores()}</td>
                    </tr>
                    <tr>
                      <th>Base Attack Bonus:</th>
                      <td>+{wc.bab}</td>
                    </tr>
                    <tr>
                      <th>Hit Points:</th>
                      <td>{wc.hp}</td>
                    </tr>
                    <tr>
                      <th>Saving Throws:</th>
                      <td>{this.getSavingThrows()}</td>
                    </tr>
                    <tr>
                      <th>Class Features:</th>
                      <td>{this.getClassFeatures()}</td>
                    </tr>
                    <tr>
                      <th>Race Features:</th>
                      <td>{this.getRaceFeatures()}</td>
                    </tr>
                    <tr>
                      <th>Skills:</th>
                      <td>{this.getSkills()}</td>
                    </tr>
                    <tr>
                      <th>Feats:</th>
                      <td>{this.getFeats()}</td>
                    </tr>
                    <tr>
                      <th>Armor Proficiency:</th>
                      <td>{wc.armorProf.join(', ')}</td>
                    </tr>
                    <tr>
                      <th>Weapon Proficiency:</th>
                      <td>{wc.weaponProf.join(', ')}</td>
                    </tr>
                    <tr>
                      <th>Languages:</th>
                      <td>{wc.languages.join(', ')}</td>
                    </tr>
                    <tr>
                      <th>Age:</th>
                      <td>{wc.details.age} years</td>
                    </tr>
                    <tr>
                      <th>Height:</th>
                      <td>{wc.details.height}</td>
                    </tr>
                    <tr>
                      <th>Weight:</th>
                      <td>{wc.details.weight}</td>
                    </tr>
                    <tr>
                      <th>Skin:</th>
                      <td>{wc.details.skin}</td>
                    </tr>
                    <tr>
                      <th>Hair:</th>
                      <td>{wc.details.hair}</td>
                    </tr>
                    <tr>
                      <th>Eyes:</th>
                      <td>{wc.details.eyes}</td>
                    </tr>
                    <tr>
                      <th>Description:</th>
                      <td>{wc.details.description}</td>
                    </tr>
                    <tr>
                      <th>Personality:</th>
                      <td>{wc.details.personality}</td>
                    </tr>
                    <tr>
                      <th>Background:</th>
                      <td>{wc.details.background}</td>
                    </tr>
                    {wc.spellList.length
                    ? <tr>
                        <th>Spells Known:</th>
                        <td>{wc.spellList.sort((a,b) => a.name > b.name ? 1 : -1)
                            .map(s => s.name).join(', ')}</td>
                      </tr>
                    : null}
                    <tr>
                      <th>Armor:</th>
                      <td>{this.equipmentList('armor')}</td>
                    </tr>
                    <tr>
                      <th>Weapons:</th>
                      <td>{this.equipmentList('weapons')}</td>
                    </tr>
                    <tr>
                      <th>Gear:</th>
                      <td>{this.equipmentList('gear')}</td>
                    </tr>
                    <tr>
                      <th>Remaining Gold:</th>
                      <td>{wc.remainingMoney}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <th colSpan="2">
                        <Button 
                          className="btn-metal"
                          onClick={() => window.print()}>
                            PRINT
                        </Button>
                      </th>
                    </tr>
                  </tfoot>
                </table>
              : <NoWorkingCharacter msg="preview character"/>
            }
            
          </div>
      </PageWrap>
    )
  }
}