import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { PageWrap, Loading } from '../Utilities'
import { RaceButton } from '../Race'
import { Dialog } from '../Dialog'
import update from '../../updateCharacter'
import './Race.css'


/* ==============================================================================================
    RACE PAGE
============================================================================================== */

export default class Race extends Component {

  // PROP TYPES
  static propTypes = {
    setAppState: PropTypes.func.isRequired,
    workingCharacter: PropTypes.object.isRequired,
    saveCharacter: PropTypes.func.isRequired,
    selectedRace: PropTypes.string,
    openConfirm: PropTypes.bool,
    openValidate: PropTypes.bool,
    loading: PropTypes.bool,
    loadingText: PropTypes.string,
    personalities: PropTypes.object.isRequired,
    races: PropTypes.arrayOf(PropTypes.string).isRequired
  }


  // CLICK HANDLER FOR THE RACE BUTTON. OPENS A CONFIRMATION DIALOG, OR A
  // VALIDATION DIALOG IF NO WORKING CHARACTER HAS BEEN ESTABLISHED
  selectRace(race) {
    if (!this.props.workingCharacter._id) {
      return this.props.setAppState({ openValidate: true })
    }
    this.props.setAppState({ 
      selectedRace: race, 
      openConfirm: true
    })
  }


  // CLOSES THE OPEN DIALOG AND COPIES THE WORKING CHARACTER TO
  // PASS TO THE addRace FUNCTION
  checkConfirmation(action) {
    if (action === 'dismiss') {
      this.props.setAppState({ 
        openConfirm: false, 
        openValidate: false
      })
      return
    }
    this.props.setAppState({ openConfirm: false })
    const character = {...this.props.workingCharacter}
    this.addRace(character)
  }


  // UPDATES THE USER'S CHARACTER AND ADVANCES THE PAGE
  async addRace(character) {
    character.race = this.props.selectedRace
    this.props.setAppState({
      loading: true,
      loadingText: 'Updating character race...'
    })
    character = await update.updateCharacter(character)
    this.props.saveCharacter(character, 'abilities')
  }


  // GET THE SELECTED RACE'S PERSONALITY DESCRIPTION
  getPersonality() {
    const desc = this.props.personalities[this.props.selectedRace]
    return desc.map((line, i) => <p key={i} style={{ marginBottom: 16 }}>{line}</p>)
  }

  // RENDER THE COMPONENT
  render() {
    // Set RaceButton event handlers from constant classes
    const select = {}
    this.props.races.forEach(race => select[race] = this.selectRace.bind(this, race))
    const race = this.props.selectedRace

    // RETURN JSX
    return (
      <PageWrap image="race">
        {this.props.loading 
          ? <Loading>{this.props.loadingText}</Loading>
          : null}

        <div className="race-container">
          {this.props.races.map(race => 
            <RaceButton key={race} name={race[0].toUpperCase() + race.slice(1)} image={race} handleClick={select[race]}/>
          )}
        </div>

        {this.props.openConfirm
          ? <Dialog 
              modal={true}
              header={`Confirm Race: ${race[0].toUpperCase() + race.slice(1)}`}
              onAction={this.checkConfirmation.bind(this)}
            >
              <p>You are going to make {this.props.workingCharacter.name} a {this.props.selectedRace}.</p>
              <br/>
              {this.getPersonality()}
              <p>Is this okay?</p>
            </Dialog>
          : null}
          
        {this.props.openValidate
          ? <Dialog 
              modal={true}
              header="No Working Character!"
              onAction={this.checkConfirmation.bind(this)}
              hasCancel={false}
            >
              <p>You must have a working character to save ability scores to.</p><br></br>
              <p>To create a working character, go to the First Steps page.</p>
            </Dialog>
          : null}
      </PageWrap>
    )
  }
}