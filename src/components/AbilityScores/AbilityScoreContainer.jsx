import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AbilityScore } from '../AbilityScores'
import { BorderWrap } from '../Utilities'


/* ==============================================================================================
    PARENT CONTAINER FOR THE ABILITY SCORE SELECTORS
============================================================================================== */

export default class AbilityScoreContainer extends Component {

  // PROP TYPES
  static propTypes = {
    workingCharacter: PropTypes.object,
    ability: PropTypes.string,
    totalPoints: PropTypes.arrayOf(PropTypes.number),
    setPoints: PropTypes.func,
    setScore: PropTypes.func,
    remaining: PropTypes.number,
    points: PropTypes.number
  }


  // EVENT HANDLER FOR INCREMENTING/DECREMENTING AN ABILITY SCORE
  change(idx, points, score) {
    this.props.setPoints(idx, points)
    this.props.setScore(idx, score)
  }
  

  // RENDER COMPONENT
  render() {
    const { abilities, remaining, points } = this.props
    return (
      <div className="abilityPoints">
        <BorderWrap size="small">
          <h2 className="abilityTitle">Ability Scores</h2>
          {abilities.map((item, idx) => 
            <AbilityScore 
              key={idx} 
              ability={item} 
              changeHandler={this.change.bind(this, idx)}
              workingCharacter={this.props.workingCharacter}
              points={this.props.totalPoints[idx]}
            />
          )}
          <h2 className={(remaining < 0) ? "ptTotal overspent" : "ptTotal good"}>Points: {points}</h2>
        </BorderWrap>
      </div>
    )
  }
}