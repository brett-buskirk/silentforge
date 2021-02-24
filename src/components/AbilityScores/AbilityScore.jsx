import React, { Component } from "react"
import PropTypes from 'prop-types'
import DND from '../../D&D'


/* ==============================================================================================
    COMPONENT FOR INDIVIDUAL ABILITY SELECTORS
============================================================================================== */

export default class AbilityScore extends Component {

  // PROP TYPES
  static propTypes = {
    changeHandler: PropTypes.func.isRequired,
    workingCharacter: PropTypes.object,
    ability: PropTypes.string,
    points: PropTypes.number
  }


  // SET TOTAL SPENT POINTS ON THIS ABILITY
  setNewPoints() {
    const abilPoints = DND.calcPoints(this._input.value)
    const abilScore = this._input.value
    this.props.changeHandler(abilPoints, abilScore)
  }


  // SET VALUE OF PREEXISTING SCORES FROM WORKING CHARACTER
  componentDidMount() {
    const { workingCharacter } = this.props
    if (workingCharacter._id) {
      const score = workingCharacter.abilities[this._input.id].basic
      this._input.value = score
    } else {
      this._input.value = 8
    }
  }
  

  // RENDER COMPONENT
  render() {
    return (
      <div className="abilityScore">
        <p className="abilityLabel">{this.props.ability}: </p>
        <input 
          id={this.props.ability}
          onChange={this.setNewPoints.bind(this)} 
          ref={(el) => this._input = el} 
          type="number" 
          min="8" max="18" step="1">
        </input>
        <label className="pointLabel">{this.props.points} point{(this.props.points === 1) ? '' : 's'}</label>
      </div>
    )
  }
}