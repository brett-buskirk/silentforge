import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { PageWrap, Loading, NoWorkingCharacter } from '../Utilities'
import { Button } from '../FormControls'
import { FeatSelector } from '../Feats'
import { Dialog } from '../Dialog'
import update from '../../updateCharacter'
import DND from '../../D&D'
import './Feats.css'


/* ==============================================================================================
    FEATS PAGE
============================================================================================== */

export default class Feats extends Component {

  // PROP TYPES
  static propTypes = {
    setAppState: PropTypes.func.isRequired,
    workingCharacter: PropTypes.object.isRequired,
    saveCharacter: PropTypes.func.isRequired,
    selectedRace: PropTypes.string,
    openConfirm: PropTypes.bool,
    openValidate: PropTypes.bool,
    feats: PropTypes.arrayOf(PropTypes.object),
    featList: PropTypes.bool,
    selectedFeats: PropTypes.arrayOf(PropTypes.string),
    featsValidated: PropTypes.arrayOf(PropTypes.bool)
  }


  // CHECK FOR FEAT PREREQUISITES
  checkPrerequisites(feat) {
    const val = Array.from(this.props.featsValidated)
    const { workingCharacter, selectedFeats } = this.props

    // create feat object with subobject properties
    const feats = {}
    this.props.feats.forEach(feat => {
      feats[feat.name] = {
        description: feat.benefit,
        pre: feat.pre
      }
    })
    
    // check the prerequisites of each feat selected so far
    feat.forEach(f => {
      // check id of array to correspond with following indexes:
      // inital: 0, human: 1, fighter: 2
      const idx = f.type === 'init' ? 0 : f.type === 'hum' ? 1 : 2

      // set array element to false initially
      val[idx] = false

      // if no name or an incorrect name is provided, set the value to null
      if (!f.name || !feats.hasOwnProperty(f.name)) {
        this.addSelected(null, f.type)

      // otherwise, run more checks...
      } else {
        // if the feat doesn't have any prerequisites, add it
        if (!feats[f.name].pre) {
          val[idx] = true
          this.addSelected(f.name, f.type)

        // if the feat has prerequisites, check them and add if they are met
        } else {
          let met = true
          const prerequisites = feats[f.name].pre.split(', ')
          prerequisites.forEach(pre => {
            if (!DND.meetRequirement(pre, workingCharacter, selectedFeats)) met = false
          })
          val[idx] = met
          this.addSelected(f.name, f.type)
        }
      }
    })

    // set the app state for the validation of the feats
    this.props.setAppState({ featsValidated: val })
  }


  // ADD A SELECTED FEAT TO THE STATE ARRAY
  addSelected(feat, id) {
    const cpyFeats = Array.from(this.props.selectedFeats)
    switch (id) {
      case 'init':
        cpyFeats[0] = feat
        break;
      case 'hum':
        cpyFeats[1] = feat
        break;
      case 'ftr':
        cpyFeats[2] = feat
        break;
      default:
        console.warn('Unknown feat type')
    }
    this.props.setAppState({ selectedFeats: cpyFeats })
  }


  // SWITCH BETWEEN FEAT SELECTION AND VIEWING ALL FEATS
  changeViews() {
    this.props.setAppState({ featList: !this.props.featList })
  }


  // VERIFY THAT EVERY FEAT IS VALIDATED
  verifySelections() {
    if (this.props.featsValidated.every(el => el)) {
      this.props.setAppState({ openConfirm: true })
    } else {
      this.props.setAppState({ openValidate: true })
    }
  }


  // DISMISS THE DIALOG AND IF CONFIRMED, SAVE THE FEATS
  checkConfirmation(action) {
    if (action === 'dismiss') {
      this.props.setAppState({
        openConfirm: false,
        openValidate: false
      })
      return
    }
    this.props.setAppState({ openConfirm: false })
    this.saveFeats()
  }


  // SAVE THE FEATS TO THE WORKING CHARACTER AND DATABASE
  async saveFeats() {
    // copy the working character
    let character = {...this.props.workingCharacter}

    // set the feats
    const featList = []
    this.props.selectedFeats.filter(feat => feat)
      .forEach(feat => {
        featList.push({
          name: feat,
          focus: null
        })
      })
    character.feats = featList

    // display the loading component
    this.props.setAppState({
      loading: true,
      loadingText: 'Updating feats...'
    })

    // update the character
    character = await update.updateCharacter(character)

    // save the character
    this.props.saveCharacter(character, 'equipment')
  }


  // CHECK FOR COMPONENT UPDATE
  shouldComponentUpdate(nextProps, nextState) {
    // update if viewing feat list section or back
    if (nextProps.featList !== this.props.featList) {
      return true
    }

    // update if validation dialog updated
    if (nextProps.openValidate !== this.props.openValidate) {
      return true
    }

    // update if confirmation dialog updated
    if (nextProps.openConfirm !== this.props.openConfirm) {
      return true
    }

    // do not update if selected feats or validations are not changed
    if (nextProps.selectedFeats.join() === this.props.selectedFeats.join()) {
      if (nextProps.featsValidated.join() === this.props.featsValidated.join()) {
        return false
      }
    }

    // update otherwise
    return true
  }


  // CHECK THE VALIDITY OF ANY EXISTING FEATS
  checkExistingFeats() {
    const { selectedFeats } = this.props
    const feats = []

    if (selectedFeats[0]) feats.push({ name: selectedFeats[0], type: 'init' })
    if (selectedFeats[1]) feats.push({ name: selectedFeats[1], type: 'hum' })
    if (selectedFeats[2]) feats.push({ name: selectedFeats[2], type: 'ftr' })
    this.checkPrerequisites(feats)
  }


  // CHECK THE PREREQUISITES OF ANY FEATS SELECTED AFTER UPDATE
  componentDidUpdate() {
    this.checkExistingFeats()
  }


  // CHECK THE PREREQUISITES OF ANY FEATS AFTER MOUNTING
  componentDidMount() {
    this.checkExistingFeats()
  }


  // RENDER THE COMPONENT
  render() {

    // individual feat blocks
    const featList = this.props.feats.map((feat, i) => 
      <div className="featBlock" key={i}>
        <p className="featName">{feat.name}</p>
        {feat.pre ? <p className="featPre"><span>Prerequisites:</span> {feat.pre}</p> : null}
        <p className="featBenefit"><span>Benefit:</span> {feat.benefit}</p>
      </div>
    )

    // create an object with all feats
    const allFeats = {}
    this.props.feats.forEach(feat => {
      allFeats[feat.name] = {
        description: feat.benefit,
        pre: feat.pre,
        ftr: feat.ftr ? true : false
      }
    })

    // get the working character
    const wc = this.props.workingCharacter

    // feat Options section (for the selection of feats)
    const featOptions = () => {
      // common properties to pass to FeatSelector components
      const common = {
        selected: this.props.selectedFeats,
        changeFeat: this.checkPrerequisites.bind(this),
        allFeats
      }

      const {selectedFeats, featsValidated } = this.props

      // return feat selectors for appropriate types
      return (
        <div id="featOptions">
          <h1>Select Feats</h1>
          <FeatSelector 
            {...common} 
            id="init" 
            title="Initial Feat" 
            defaultValue={selectedFeats[0]}
            val={featsValidated[0]}/>
          {wc.race === 'human'
            ? <FeatSelector 
            {...common} 
            id="hum" 
            title="Human Feat" 
            defaultValue={selectedFeats[1]}
            val={featsValidated[1]}/>
            : null}
          {wc.class === 'fighter'
            ? <FeatSelector 
            {...common} 
            id="ftr" 
            title="Fighter Feat" 
            defaultValue={selectedFeats[2]}
            val={featsValidated[2]}/>
            : null}
        </div>
      )
    }

    // feat Listing section
    const featListing = () => (
      <div id="featListing">
        {featList}
      </div>
    )

    // buttons for feats
    const featButtons = () => (
      <>
        <Button 
          className="btn-metal" 
          onClick={() => this.changeViews()}>
            {this.props.featList ? "Back" : "View Feat Details"}
        </Button>
        {!this.props.featList
          ? <Button 
              onClick={() => this.verifySelections()}
              className="btn-metal save-feats">
                Save Feats
            </Button>
          : null}
      </>
    )

    // bonus feats section
    const bonusFeats = (confirm) => (
      wc.class === 'ranger' || wc.race === 'elf'
        ? confirm
            ? <>
                <br/>
                <h4>Bonus Feats:</h4>
                {wc.class === 'ranger' 
                  ? <p>Track</p> 
                  : null}
                {wc.race === 'elf' 
                  ? <p>Martial Weapon Proficiency (longsword, rapier, longbow, shortbow)</p> 
                  : null}
              </>
            : <>
                <h3>Bonus Feats:</h3>
                <ul>
                  {wc.class === 'ranger' 
                    ? <li>Track</li> 
                    : null}
                  {wc.race === 'elf' 
                    ? <li>Martial Weapon Proficiency (longsword, rapier, longbow, shortbow)</li> 
                    : null}
                </ul>
              </>
        : null
    )

    // return the page markup
    return (
      <PageWrap image="feats">

        {this.props.loading 
          ? <Loading>{this.props.loadingText}</Loading>
          : null}

        <div className="feat-container">
          {wc._id
            ? <>
                {!this.props.featList ? featOptions() : null}
                {this.props.featList ? featListing() : null}
                {featButtons()}
                {!this.props.featList ? bonusFeats() : null}
              </>
            : <NoWorkingCharacter msg="pick feats"/>}
        </div>

        {this.props.openValidate
          ? <Dialog 
              modal={true}
              header="Unmet Prerequisites"
              onAction={this.checkConfirmation.bind(this)}
              hasCancel={false}>
                <div>
                  <p>You have selected at least one feat for which your character has not met the prerequisites.</p> 
                  <br/>
                  <p>Please adjust you feats until they all have a green checkmark beside them. To view feat prerequisites, click the View Feat Details button.</p>
                </div>  
            </Dialog>
          : null}

        {this.props.openConfirm
          ? <Dialog 
              modal={true}
              header="Confirm Feats"
              onAction={this.checkConfirmation.bind(this)}>
                <div>
                  <p>Your character will have the following feats:</p> 
                  <br/>
                  {this.props.selectedFeats.map((feat, i) => <p key={i}>{feat}</p>)}
                  {bonusFeats(true)}
                  <br/>
                  <p>Is this okay?</p>
                </div>  
            </Dialog>
          : null}
      </PageWrap>
    )
  }
}