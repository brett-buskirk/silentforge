import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ClassNames from 'classnames'


/* ==============================================================================================
    SKILL COMPONENT
============================================================================================== */

export default class SkillInput extends Component {

  // PROP TYPES
  static propTypes = {
    setAppState: PropTypes.func.isRequired,
    abil: PropTypes.string,
    name: PropTypes.string,
    classSkill: PropTypes.bool,
    skills: PropTypes.array,
    skillRanks: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      ranks: PropTypes.number
    }))
  }


  // GET THE POINTS VALUE OF RANKS SPENT ON THE SKILL
  getValue() {
    return this.props.classSkill 
      ? this._input.value * 1
      : this._input.value * 2
  }


  // RESET THE SKILL RANKS AND POINTS WHEN NUMBER IS CHANGED
  setNewPoints() {
    // set the text of the label
    this._label.innerText = this.getValue()

    // make a copy of the existing skill ranks
    const skillRanks = Array.from(this.props.skillRanks)
    
    // loop through the skills and set the rank of the appropriate skill
    for (let i = 0; i < skillRanks.length; i++) {
      if (skillRanks[i].name === this.props.name) {
        skillRanks[i].ranks = Number(this._input.value)
      }
    }

    // set the app state
    this.props.setAppState({ ...skillRanks })
  }


  // SET EXISTING VALUES FOR THE SKILLS WHEN THE COMPONENT MOUNTS
  componentDidMount() {
    const { name, skills } = this.props

    // get the skill for this component
    const matchedSkill = skills.filter(skill => skill.name === name)[0]

    // set the component's value to the skill's ranks
    this._input.value = matchedSkill ? matchedSkill.ranks : 0

    // set the component's points label to points spent
    this._label.innerText = matchedSkill
      ? this.props.classSkill 
        ? matchedSkill.ranks * 1 
        : matchedSkill.ranks * 2
      : 0
  }

  
  // RENDER THE COMPONENT
  render() {
    const { classSkill, name, abil } = this.props
    return (
      <tr className={ClassNames({ classSkill: classSkill })}>
        <td>{classSkill ? <span>&#10003;</span> : <span>&#10007;</span>}</td>
        <td>{name}</td>
        <td>{abil.toUpperCase()}</td>
        <td>
          <input
            onChange={this.setNewPoints.bind(this)} 
            ref={(el) => this._input = el}
            type="number" 
            min="0" 
            max="4" 
            step=".5"/>
        </td>
        <td ref={(el) => this._label = el}>0</td>
      </tr>
    )
  }
}