import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AbilityScoreContainer, CampaignPointsContainer } from '../AbilityScores'
import { PageWrap, Loading } from '../Utilities'
import { Button } from '../FormControls'
import { Dialog } from '../Dialog'
import DND from '../../D&D'
import update from '../../updateCharacter'
import './ability.css';


/* ==============================================================================================
    ABILITIES PAGE
============================================================================================== */

export default class AbilityMain extends Component {

  // PROP TYPES
  static propTypes = {
    campaigns: PropTypes.arrayOf(PropTypes.shape(
      { type: PropTypes.string, points: PropTypes.number}
    )).isRequired,
    abilities: PropTypes.arrayOf(PropTypes.string).isRequired,
    setAppState: PropTypes.func.isRequired,
    workingCharacter: PropTypes.object.isRequired,
    saveCharacter: PropTypes.func.isRequired,
    openConfirm: PropTypes.bool.isRequired,
    openValidate: PropTypes.bool.isRequired,
    campaign: PropTypes.number.isRequired,
    scores: PropTypes.arrayOf(PropTypes.number).isRequired,
    points: PropTypes.arrayOf(PropTypes.number).isRequired,
    overspent: PropTypes.bool.isRequired,
    loading: PropTypes.bool,
    loadingText: PropTypes.string
  }


  // SET SELECTED ABILITY POINTS AND CHECK FOR OVERSPENDING
  setAbilityPoints(ability, pts) {
    const points = Array.from(this.props.points)
    points[ability] = pts
    const totalPoints = points.reduce((r, pts) => r = r + pts)
    this.props.setAppState({ points: points })
    const overspent = (totalPoints > this.props.campaigns[this.props.campaign].points)
    this.props.setAppState({ overspent: overspent })
  }


  // SET SELECTED ABILITY SCORE
  setAbilityScore(ability, score) {
    const scores = Array.from(this.props.scores)
    scores[ability] = Number(score)
    this.props.setAppState({ scores: scores })
  }


  // OPEN CONFIRMATION OR VALIDATION DIALOG AS APPROPRIATE
  confirmAbilities() {
    const { overspent, workingCharacter, setAppState } = this.props
    if(overspent) return setAppState({ openValidate: true })
    if(workingCharacter._id) return setAppState({ openConfirm: true })
    return setAppState({ openValidate: true })
  }


  // DISMISS THE DIALOG AND IF CONFIRMED, SAVE THE ABILITIES
  checkConfirmation(action) {
    if (action === 'dismiss') {
      this.props.setAppState({
        openConfirm: false,
        openValidate: false
      })
      return
    }
    this.props.setAppState({ openConfirm: false })
    this.saveAbilities()
  }


  // SAVE THE ABILITIES TO THE WORKING CHARACTER AND DATABASE
  async saveAbilities() {
    // copy the working character
    let character = {...this.props.workingCharacter}
    let { abilities } = character

    // set ability scores
    let i = 0;
    for (let abil in abilities) {
      abilities[abil].basic = this.props.scores[i]
      i++
    }

    // set campaign type
    character.campaign = this.props.campaign

    // display the loading component
    this.props.setAppState({
      loading: true,
      loadingText: 'Updating ability scores...'
    })

    // update the character
    character = await update.updateCharacter(character)

    // save the character
    this.props.saveCharacter(character, 'features')
  }


  // GET ANY RACIAL ABILITY ADJUSTMENTS THE CHARACTER MAY HAVE
  getAbilityAdjustments() {
    const adjustments = []
    const list = []
    const abilities = this.props.workingCharacter.abilities
    for (let abil in abilities) {
      // get racial bonus and push it into list
      const { race } = abilities[abil]
      list.push(race)
      if (race !== 0) {
        if (race > 0) {
          // positive adjustment
          adjustments.push(`${abil.toUpperCase()} +${race}`)
        } else {
          // negaive adjustment
          adjustments.push(`${abil.toUpperCase()} ${race}`)
        }
      }
    }
    return { adjustments, list }
  }


  // SET PREEXISTING VALUES FOR WORKING CHARACTER, IF ANY
  componentDidMount() {
    const { workingCharacter, points, campaigns } = this.props
    if (workingCharacter._id) {
      const { campaign, abilities } = workingCharacter
      this.props.setAppState({
        campaign: campaign,
        scores: DND.getAbilityArray(abilities),
        points: DND.getAbilityPoints(abilities),
        overspent: DND.checkOverspend(campaign, points, campaigns)
      })
    }
  }

  
  // RENDER THE COMPONENT
  render() {
    // get remaining points to spend
    const { campaigns, abilities } = this.props
    const campaignPoints = campaigns[this.props.campaign].points
    const spentPoints = this.props.points.reduce((r, pts) => r = r + pts)
    const remaining = campaignPoints - spentPoints

    // get any racial ability adjustments
    const { adjustments, list } = this.getAbilityAdjustments()

    // RETURN JSX
    return (
      <PageWrap image="abilities">
      
        {this.props.loading 
          ? <Loading>{this.props.loadingText}</Loading>
          : null}

        <div className="abilityMain">
          <CampaignPointsContainer
            setCurCampaign={this.props.setAppState}
            curCampaign={this.props.campaign}
            campaigns={campaigns}
          />
          <AbilityScoreContainer 
            abilities={abilities} 
            setScore={this.setAbilityScore.bind(this)}
            setPoints={this.setAbilityPoints.bind(this)}
            totalPoints={this.props.points}
            points={remaining}
            remaining={remaining}
            workingCharacter={this.props.workingCharacter}
          />

          {this.props.workingCharacter._id 
            ? <div className="adjustments">
                <p>{this.props.workingCharacter.name} will have the following adjustments added to his ability scores after your selections are made.</p>
                <br/>
                <p>{adjustments.join(', ')}</p>
              </div>
            : <div className="adjustments">
                <p>No working character selected yet...</p>
                <br/>
                <p>Go to the First Steps page to select or create a new working character.</p>
              </div>
          }

          <Button 
            className="btn-metal"
            onClick={this.confirmAbilities.bind(this)}>
              Save Scores
          </Button>
        </div>

        {this.props.openConfirm
          ? <Dialog 
              modal={true}
              header="Save Ability Scores"
              onAction={this.checkConfirmation.bind(this)}
            >
              Your character will have the following ability scores:
              <table>
                <thead>
                  <tr key='head'>
                    <td key="head0">Ability</td>
                    <td key="head1">Score</td>
                    <td key="head2">Race</td>
                    <td key="head3"></td>
                    <td key="head4">Total</td>
                  </tr>
                </thead>
                <tbody>
                  {this.props.scores.map((abil, i) => 
                    <tr key={i}>
                      <td key={i + 'abil'}>{abilities[i].toUpperCase()}</td>
                      <td key={i + 'score'}>{abil}</td>
                      <td key={i + 'adj'}>{(list[i] >= 0) 
                        ? `+${list[i]}` 
                        : <span>&#8722;{Math.abs(list[i])}</span>}</td>
                      <td key={i + 'equal'}>=</td>
                      <td key={i + 'total'}>{abil + list[i]}</td>
                    </tr>
                  )}
                </tbody>
              </table>
              Is this okay?
            </Dialog>
          : null}

        {this.props.openValidate
          ? <Dialog 
              modal={true}
              header={this.props.overspent ? "Overspent Points" : "No Working Character!"}
              onAction={this.checkConfirmation.bind(this)}
              hasCancel={false}
            >{this.props.overspent 
                ? <div>
                    <p>You have spent too many points buying ability scores.</p> 
                    <br/>
                    <p>Please adjust you scores until your total Points is in the green.</p>
                  </div>
                : <div>
                    <p>You must have a working character to save ability scores to.</p> 
                    <br/>
                    <p>To create a working character, go to the First Steps page.</p>
                  </div>
              }
            </Dialog>
          : null}
      </PageWrap>
    )
  }
}