import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { PageWrap, Loading, NoWorkingCharacter } from '../Utilities'
import { Dialog } from '../Dialog'
import { Button } from '../FormControls'
import { SkillInput } from '../Skills'
import update from '../../updateCharacter'
import './Skill.css'


/* ==============================================================================================
    SKILLS PAGE
============================================================================================== */

export default class Skills extends Component {

  // PROP TYPES
  static propTypes = {
    setAppState: PropTypes.func.isRequired,
    workingCharacter: PropTypes.object.isRequired,
    saveCharacter: PropTypes.func.isRequired,
    openConfirm: PropTypes.bool,
    openValidate: PropTypes.bool,
    loading: PropTypes.bool,
    loadingText: PropTypes.string,
    spentSkillPoints: PropTypes.number,
    skills: PropTypes.arrayOf(PropTypes.object),
    skillRanks: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      ranks: PropTypes.number
    }))
  }


  // RETURN SKILL COMPONENT FOR EACH SKILL
  getSkills() {
    const characterClass  = this.props.workingCharacter.class

    return this.props.skills.map(skill => 
      <SkillInput
        setAppState={this.props.setAppState} 
        key={skill.name.toLowerCase()}
        classSkill={skill.classes.includes(characterClass)}
        skillRanks={this.props.skillRanks}
        skills={this.props.workingCharacter.skills}
        name={skill.name}
        abil={skill.abil}/>
    )
  }


  // GET THE NUMBER OF SKILL POINTS SPENT WHEN COMPONENT MOUNTS
  componentDidMount() {
    if (!this.props.workingCharacter._id) return
    const { skills } = this.props.workingCharacter
    const skillRanks = Array.from(this.props.skillRanks)
    
    // set each skill rank to 0
    skillRanks.forEach(skill => skill.ranks = 0)

    // tally the skill ranks
    let tally = 0
    skills.forEach(skill => {
      for (let i = 0; i < skillRanks.length; i++) {
        if (skillRanks[i].name === skill.name) {
          skillRanks[i].ranks = skill.ranks
          break
        }
      }
      tally += skill.classSkill ? skill.ranks : skill.ranks * 2
    })

    // set the app state
    this.props.setAppState({ 
      spentSkillPoints: tally,
      skillRanks: skillRanks 
    })
  }


  // RETURN AN ARRAY OF THE CHARACTER'S CLASS SKILLS
  classSkills() {
    const { skills, workingCharacter } = this.props
    const classSkills = skills
      .filter(skill => skill.classes.includes(workingCharacter.class))
      .map(skill => skill.name)
    return classSkills
  }


  // OPEN CONFIRMATION OR VALIDATION DIALOG AS APPROPRIATE
  confirmSkills() {
    const remaining = this.remainingSkillPoints()

    // check to see if too many points have been spent. If so,
    // open the validation dialog
    if(remaining < 0) return this.props.setAppState({ openValidate: true })

    // otherwise, open the confirmation dialog
    return this.props.setAppState({ openConfirm: true })
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
    this.saveSkills()
  }


  // RETURN THE NUMBER OF REMAINING SKILL POINTS THE CHARACTER HAS TO SPEND
  remainingSkillPoints() {
    const { workingCharacter, skillRanks } = this.props
    const spentSkillPoints = skillRanks.reduce((r,s) => r += s.ranks, 0)
    return workingCharacter.skillPoints - spentSkillPoints
  }


  // SAVE THE SKILLS TO THE WORKING CHARACTER AND DATABASE
  async saveSkills() {
    // copy the working character
    let character = {...this.props.workingCharacter}
    const classSkills = this.classSkills()

    // set skill list
    const skillList = []
    this.props.skillRanks.forEach(skill => {
      skillList.push({
        name: skill.name,
        classSkill: classSkills.includes(skill.name),
        abil: this.props.skills.filter(sk => sk.name === skill.name)[0].abil,
        ranks: skill.ranks,
        race: 0,
        class: 0,
        feat: 0
      })
    })

    // set the skills to the working character
    character.skills = skillList

    // display the loading component
    this.props.setAppState({
      loading: true,
      loadingText: 'Updating skills...'
    })

    // update the character
    character = await update.updateCharacter(character)

    // save the character
    this.props.saveCharacter(character, 'feats')
  }


  // RETURN A STRING LIST OF ALL RANKED SKILLS
  getSelectedSkills() {
    const list = this.props.skillRanks
      .filter(skill => skill.ranks > 0)
      .map(skill => `${skill.name}: ${skill.ranks} ranks`)
      .join(', ')
    return list
  }


  // RENDER THE COMPONENT
  render() {
    const { workingCharacter } = this.props
    const remaining = this.remainingSkillPoints()

    // set class names
    const pointsClass = classNames({
      points: true,
      overspent: (remaining < 0)
    })

    // RETURN JSX
    return (
      <PageWrap image="skills">
      
        {this.props.loading 
          ? <Loading>{this.props.loadingText}</Loading>
          : null}

      <div className="skill-container">
        {workingCharacter._id
          ? <div> 
              <div className="topContainer">
                <p className={pointsClass}>Points Remaining: {remaining}</p>
                <Button 
                  className="btn-metal"
                  onClick={this.confirmSkills.bind(this)}>
                    Save Skills
                </Button>
                <table className="tableHeader">
                  <thead>
                  <tr>
                    <th>CS</th>
                    <th>Skill Name</th>
                    <th>Abil</th>
                    <th>RANKS</th>
                    <th>Cost</th>
                  </tr>
                  </thead>
                </table>
              </div>
              <div className="tableContainer">
                <table className="skillTable">
                  <tbody>
                    {this.getSkills()}
                  </tbody>
                </table>
              </div>
            </div>
          : <NoWorkingCharacter msg="allocate skills"/>
        }
      </div>

      {this.props.openConfirm
        ? <Dialog 
            modal={true}
            header="Save Skills"
            onAction={this.checkConfirmation.bind(this)}
          >
            <p>Your character will have the following skills and ranks:</p>
            <br/>
            <p>{this.getSelectedSkills()}</p>
            <br/>
            <p>Is this okay?</p>
          </Dialog>
        : null}

      {this.props.openValidate
        ? <Dialog 
            modal={true}
            header="Overspent Skill Points"
            onAction={this.checkConfirmation.bind(this)}
            hasCancel={false}
          > 
            <div>
              <p>You have spent too many points buying skills.</p> 
              <br/>
              <p>Please adjust you scores until your total Points Remaining is in the green.</p>
            </div>
          </Dialog>
        : null}
      </PageWrap>
    )
  }
}