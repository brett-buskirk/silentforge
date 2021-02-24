import React, { Component } from 'react'
import PropTypes from 'prop-types'
import fetch from 'isomorphic-fetch'
import { PageWrap, BorderWrap, Loading } from '../Utilities'
import { Button, Form } from '../FormControls'
import { Dialog } from '../Dialog'
import DND from '../../D&D'
import './FirstSteps.css'

/* ==============================================================================================
    FIRST STEPS PAGE
============================================================================================== */

export default class FirstSteps extends Component {

  // PROP TYPES
  static propTypes = {
    setAppState: PropTypes.func.isRequired,
    allCharacters: PropTypes.arrayOf(PropTypes.object).isRequired,
    character: PropTypes.object.isRequired,
    loading: PropTypes.bool,
    loadingText: PropTypes.string,
    openConfirm: PropTypes.bool,
    openValidate: PropTypes.bool
  }


  // OPEN EITHER THE CONFIRMATION DIALOG OR VALIDATION DIALOG
  confirmCharacter() {
    const formData = this.refs.form.getData()
    const { existing, name } = formData

    // if no data is provided, open the validation dialog
    if (existing === 'none' && !name) return this.props.setAppState({ openValidate: true })

    // otherwise, get existing character or set new character
    if (existing !== 'none') {
      this.getCharacter(existing)
    } else {
      this.props.setAppState({ 
        character: formData,
        openConfirm: true
      })
    }
  }


  // DISMISS THE DIALOG COMPONENT AND SAVE THE CHARACTER IF APPROPRIATE
  checkConfirmation(action) {
    if (action === 'dismiss') {
      this.props.setAppState({ 
        openConfirm: false,
        openValidate: false
      })
      return
    }
    this.props.setAppState({ openConfirm: false })
    this.saveCharacter()
  }


  // SET THE WORKING CHARACTER TO THE SELECTED CHARACTER, OR CREATE A NEW
  // CHARACTER IN THE DATABASE AND SET IT TO THE WORKING CHARACTER
  saveCharacter() {
    // if saving an existing character...
    if (this.props.character._id) {
      // get the character's feats
      const selected = DND.setSelectedFeats(this.props.character)

      // set feat validation holder
      const val = [
        false, 
        (this.props.character.race === 'human') ? false : true, 
        (this.props.character.class === 'fighter') ? false : true,
      ]

      // set the character's cantrips
      const cantrips = this.props.character.spellList
        .filter(c => c.level === 0).map(c => c.name)
      
      // set the character's spells
      const spells = this.props.character.spellList
        .filter(s => s.level === 1).map(s => s.name)

      // get the character's equipment
      const equip = DND.setSelectedEquipment(this.props.character)

      // set the app state
      this.props.setAppState({ 
        workingCharacter: this.props.character,
        selectedFeats: selected,
        currentPage: 'class',
        featsValidated: val,
        selectedCantrips: cantrips,
        selectedSpells: spells,
        selectedEquipment: equip
      })
    
    // else create a new character...
    } else {
      // display the loading div
      this.props.setAppState({
        loading: true,
        loadingText: 'Saving character...'
      })

      // add the character's data to the database
      fetch('/api/character',
        {
          method: 'POST',
          body: JSON.stringify(this.props.character),
          headers: { 'Content-Type': 'application/json'}
        })
        .then(res => res.json())
        .then(json => {
          // set the working character, reset app state
          this.props.setAppState({
            workingCharacter: json,
            loading: false,
            currentPage: 'class',
            selectedFeats: [],
            featsValidated: [false, false, false],
            selectedCantrips: [],
            selectedSpells: [],
            selectedEquipment: {
              armor: [],
              weapons: [],
              gear: []
            }
          })
        })
    }
  }


  // IF A CHARACTER IS SELECTED, GET THAT CHARACTER'S DETAILS FROM THE DATABASE
  // AND SET THE CHARACTER STATE OBJECT TO HOLD THAT CHARACTER
  getCharacter(characterId) {
    // Display the loading div
    this.props.setAppState({
      loadingText: 'Retrieving character data...',
      loading: true
    })

    // Fetch the character data from the database
    fetch(`/api/character/${characterId}`)
      .then(res => res.json())
      .then(json => {
        // Set the character, hide the loading div, and open confirmation dialog
        this.props.setAppState({
          character: json,
          loading: false,
          openConfirm: true
        })
      })
  }


  // WHEN THE COMPONENT MOUNTS, GET A LIST OF ALL CHARACTERS FROM THE DB
  componentDidMount() {
    // Display the loading div
    this.props.setAppState({
      loadingText: 'Retrieving characters...',
      loading: true
    })

    // Fetch the list of all available characters
    fetch('/api/character')
      .then(res => res.json())
      .then(json => {
        // set allCharacters and hide the loading div
        this.props.setAppState({
          allCharacters: json,
          loading: false
        })
      })
  }

  
  // RENDER THE COMPONENT
  render() {
    return (
      <PageWrap image="first">

        {this.props.loading 
          ? <Loading>{this.props.loadingText}</Loading>
          : null}

        <div className="FirstSteps">
        <BorderWrap id="formWrap" size="medium">
          <h1>Let's Get Started!</h1>
          <h3>Select an existing character or begin creating a new one by supplying a name and a few details about it.</h3>
          <hr/><br/>
          <Form
            ref="form"
            fields={[
              {type: 'select', label: 'Existing Character', id: 'existing', options: this.props.allCharacters},
              {id: 'hr', comment: true},
              {label: 'Character Name', id: 'name', placeholder: 'some awesome name...', ref: 'name'},
              {id: 'detailsComment', comment: true},
              {type: 'select', id: 'gender', label: 'Gender', options: [{ name: 'male', _id: 'male'}, { name: 'female', _id: 'female' }]},
              {id: 'skin', label: 'Skin', placeholder: 'skin description...'},
              {id: 'hair', label: 'Hair', placeholder: 'hair color/length...'},
              {id: 'eyes', label: 'Eyes', placeholder: 'eye color...'},
              {id: 'description', label: 'Description', placeholder: 'physical description...'},
              {id: 'noteComment', comment: true}
            ]}
            initialData={{
              detailsComment: 'Now add some cool details about your character!',
              noteComment: 'NOTE: Filling out this form will change your current working character.',
              hr: <hr/> 
            }} />
          <Button 
            id="create-character"
            className="btn-metal"
            onClick={this.confirmCharacter.bind(this)}>
              LET'S GO!
          </Button>
        </BorderWrap>
        </div>

        {this.props.openConfirm
          ? <Dialog 
              modal={true}
              header={this.props.character.name || ''}
              onAction={this.checkConfirmation.bind(this)}
            >
              <p>You are about to set {this.props.character.name} as your current working character.</p><br></br>
              <p>
                You can set or change specific details (such as class, race, or equipment) about your working character 
                as you go from page to page. You can always go back and change any detail until you have your character
                perfectly fine-tuned.
              </p>
              <br/>
              <p>
                To change your working character, return to this page and either select an existing character to modify 
                or create a new one by supplying a name and/or brief description. Have fun and good luck!
              </p>
              <br/>
              <p>Is this okay?</p>
            </Dialog>
          : null}
          
        {this.props.openValidate
          ? <Dialog 
              modal={true}
              header="No Character Name!"
              onAction={this.checkConfirmation.bind(this)}
              hasCancel={false}
            >
              You must either select an existing character, or at least provide a name for a new character.
            </Dialog>
          : null}
      </PageWrap>
    )
  }
}