import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { PageWrap, BorderWrap, Loading, NoWorkingCharacter } from '../Utilities'
import { BasicFeatures, FeatureButtonGroup, RangerFeatures, BardFeatures, SorcererFeatures } from '../Features'
import { Dialog } from '../Dialog'
import update from '../../updateCharacter'
import './Features.css'


/* ==============================================================================================
    FEATURES PAGE
============================================================================================== */

export default class Features extends Component {

  // PROP TYPES
  static propTypes = {
    setAppState: PropTypes.func.isRequired,
    workingCharacter: PropTypes.object.isRequired,
    saveCharacter: PropTypes.func.isRequired,
    selectedRace: PropTypes.string,
    openConfirm: PropTypes.bool,
    openValidate: PropTypes.bool,
    favoredEnemies: PropTypes.arrayOf(PropTypes.object),
    bardSpells: PropTypes.object,
    sorcererSpells: PropTypes.object,
    deities: PropTypes.arrayOf(PropTypes.object),
    moreFeatures: PropTypes.bool,
    loading: PropTypes.bool,
    loadingText: PropTypes.string,
    favoredEnemy: PropTypes.string,
    features: PropTypes.object,
    selectedCantrips: PropTypes.arrayOf(PropTypes.string),
    selectedSpells: PropTypes.arrayOf(PropTypes.string)
  }


  // CONFIRM THE CLASS FEATURES
  confirmFeatures() {
    const wc = this.props.workingCharacter
    const formData = this.refs.form.getData()
    const { name } = formData
    const { selectedCantrips, selectedSpells, setAppState } = this.props

    // if no data is provided, open the validation dialog
    if (!name) return setAppState({ openValidate: true })

    // look for overspending on spells
    if (selectedCantrips.length > 4) return setAppState({ openValidate: true })
    if (selectedSpells.length > 2) return setAppState({ openValidate: true })

    // set the favored enemy, if any
    formData.favoredEnemy = wc.class === 'ranger' ? this.props.favoredEnemy : null

    // else, open the confirmation dialog
    this.props.setAppState({ 
      openConfirm: true,
      features: formData 
    })
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
    this.saveFeatures()
  }


  // SAVE THE FEATURES TO THE WORKING CHARACTER AND DATABASE
  async saveFeatures() {
    // copy the working character
    let character = {...this.props.workingCharacter}
    const features = {...this.props.features}
    const { favoredEnemy } = features

    // set the favored enemy, if any
    delete features.favoredEnemy
    character.details = features
    if (favoredEnemy) {
      character.favoredEnemy = `favored enemy (${favoredEnemy.toLowerCase()})`
    }

    // set the spells, if any
    const characterSpells = []
    this.props.selectedCantrips.forEach(cntrp => 
      characterSpells.push({ name: cntrp, level: 0 }))
    this.props.selectedSpells.forEach(spell => 
      characterSpells.push({ name: spell, level: 1 }))
    character.spellList = characterSpells

    // display the loading component and clear features
    this.props.setAppState({
      loading: true,
      loadingText: 'Updating features...',
      features: {}
    })

    // update the character
    character = await update.updateCharacter(character)

    // save the character
    this.props.saveCharacter(character, 'skills')
  }


  // TEMPORARILY SET THE FEATURES
  setFeatures() {
    const formData = this.refs.form.getData()
    this.props.setAppState({ features: formData })
  }


  // TEMPORARILY SET THE FAVORED ENEMEY
  setEnemy(enemy) {
    this.props.setAppState({
      favoredEnemy: enemy
    })
  }


  // WHEN COMPONENT MOUNTS, CHECK TO SEE IF CHARACTER IS A RANGER
  componentDidMount() {
    const wc = this.props.workingCharacter

    // forget it if there is no working character
    if (!wc._id) return

    // if the character is a ranger...
    if (wc.class === 'ranger') {

      // look for an existing favored enemy
      const regex = /favored enemy \((\w+)\)/
      const feature = wc.classFeatures[0]
      let find = regex.exec(feature)

      // if found, set the favoredEnemy state to the enemy specified
      if (find) {
        const enemy = find[1][0].toUpperCase() + find[1].slice(1)
        this.props.setAppState({ favoredEnemy: enemy })
      }
    }
  }


  // RENDER THE COMPONENT
  render() {
    const wc = this.props.workingCharacter

    // set feature display for specific type of character classes
    const moreFeatures = () => {
      switch (wc.class) {
        case 'bard':
          return (
            <>
              <h1>Bard Spells</h1>
              <BardFeatures 
                bardSpells={this.props.bardSpells}
                selectedCantrips={this.props.selectedCantrips}
                setAppState={this.props.setAppState}
                />
              <br/>
            </>
          )
        case 'ranger':
          return (
            <>
            <h1>Favored Enemy</h1>
            <RangerFeatures 
              enemies={this.props.favoredEnemies}
              setEnemy={this.setEnemy.bind(this)}
              defaultValue={this.props.favoredEnemy}
              id="favEnemy"/>
            <br/>
            </>
          )
        case 'sorcerer':
          return (
            <>
              <h1>Sorcerer Spells</h1>
              <SorcererFeatures 
                sorcererSpells={this.props.sorcererSpells}
                selectedCantrips={this.props.selectedCantrips}
                selectedSpells={this.props.selectedSpells}
                setAppState={this.props.setAppState}
                />
              <br/>
            </>
          )
        default:
          return null
      }
    }

    // check for spell overspending
    const cantrips = this.props.selectedCantrips.length > 4
    const spells = this.props.selectedSpells.length > 2

    // RETURN JSX
    return (
      <PageWrap image="features">

        {this.props.loading 
          ? <Loading>{this.props.loadingText}</Loading>
          : null}

        <div className="Features">
          <BorderWrap id="formWrap" size="medium">
            {wc._id
              ? <>
                  {!this.props.moreFeatures
                    ? <BasicFeatures 
                        wc={wc} 
                        ref="form"
                        features={this.props.features} 
                        deities={this.props.deities}/>
                    : moreFeatures()}
                  {<FeatureButtonGroup
                    setFeatures={this.setFeatures.bind(this)} 
                    moreFeatures={this.props.moreFeatures}
                    setAppState={this.props.setAppState}
                    confirm={this.confirmFeatures.bind(this)}
                    charClass={wc.class}/>}
                </>
              : <NoWorkingCharacter msg="assign features"/>}
          </BorderWrap>
        </div>

        {this.props.openConfirm
          ? <Dialog 
              modal={true}
              header="Confirm Features"
              onAction={this.checkConfirmation.bind(this)}>
                <div>
                  <p>Are you sure you want to change your character's features?</p> 
                </div>  
            </Dialog>
          : null}

        {this.props.openValidate
          ? <Dialog 
              modal={true}
              header={cantrips || spells ? "Too Many Spells" : "No Character Name!"}
              onAction={this.checkConfirmation.bind(this)}
              hasCancel={false}
            >
              {cantrips || spells
                ? "You have selected too many spells. Return to the spell section and trim your selection."
                : "Your character must at least have a name."}
            </Dialog>
          : null}
      </PageWrap>
    )
  }
}