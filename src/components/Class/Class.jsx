import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { PageWrap, Loading } from '../Utilities'
import { ClassButton } from '../Class'
import { Dialog } from '../Dialog'
import update from '../../updateCharacter'
import './Class.css'


/* ==============================================================================================
    CLASS PAGE
============================================================================================== */

export default class Class extends Component {

  // PROP TYPES
  static propTypes = {
    setAppState: PropTypes.func.isRequired,
    workingCharacter: PropTypes.object.isRequired,
    saveCharacter: PropTypes.func.isRequired,
    selectedClass: PropTypes.string,
    openConfirm: PropTypes.bool,
    openValidate: PropTypes.bool,
    loading: PropTypes.bool,
    loadingText: PropTypes.string,
    descriptions: PropTypes.object.isRequired,
    classes: PropTypes.arrayOf(PropTypes.string).isRequired
  }


  // CLICK HANDLER FOR CLASS BUTTON. OPENS CONFIRMATION DIALOG, OR A 
  // VALIDATION DIALOG IF NO WORKING CHARACTER HAS BEEN ESTABLISHED
  selectClass(className) {
    if (!this.props.workingCharacter._id) {
      return this.props.setAppState({ openValidate: true })
    }
    this.props.setAppState({
        selectedClass: className,
        openConfirm: true
      })
  }


  // CLOSE THE OPEN DIALOG AND COPY THE WORKING CHARACTER TO
  // PASS TO THE addClass FUNCTION
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
    this.addClass(character)
  }


  // UPDATE THE CHARACTER AND ADVANCE THE PAGE TO THE RACE PAGE
  async addClass(character) {
    character.class = this.props.selectedClass
    this.props.setAppState({ 
      loading: true,
      loadingText: 'Updating character class...'
    })
    character = await update.updateCharacter(character)
    this.props.saveCharacter(character, 'race')
  }


  // MAP CLASS DESCRIPTIONS TO INDIVIDUAL <p> ELEMENTS
  getDescription() {
    const desc = this.props.descriptions[this.props.selectedClass]
    return desc.map((line, i) => <p key={i} style={{ marginBottom: 16 }}>{line}</p>)
  }


  // RENDER THE COMPONENT
  render() {
    // set ClassButton event handlers from constant classes
    const select = {}
    this.props.classes.forEach(cls => select[cls] = this.selectClass.bind(this, cls))
    const cls = this.props.selectedClass

    // RETURN JSX
    return (
      <PageWrap image="class">
        {this.props.loading 
          ? <Loading>{this.props.loadingText}</Loading>
          : null}

        <div className="class-container">
          {this.props.classes.map(cls => 
            <ClassButton key={cls} name={cls[0].toUpperCase() + cls.slice(1)} image={cls} handleClick={select[cls]} />
          )}
        </div>

        {this.props.openConfirm
          ? <Dialog 
              modal={true}
              header={`Confirm Class: ${cls[0].toUpperCase() + cls.slice(1)}`}
              onAction={this.checkConfirmation.bind(this)}
            >
              <p>You are going to make {this.props.workingCharacter.name} a {cls}.</p>
              <br/>
              {this.getDescription()}
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