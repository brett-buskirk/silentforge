import React, { Component } from 'react'
import fetch from 'isomorphic-fetch'
import { Dialog } from './components/Dialog'
import { Home } from './components/Home'
import { FirstSteps } from './components/FirstSteps'
import { Class } from './components/Class'
import { Race } from './components/Race'
import { AbilityMain } from './components/AbilityScores'
import { Features } from './components/Features'
import { Skills } from './components/Skills'
import { Feats } from './components/Feats'
import { Equipment } from './components/Equipment'
import { Preview } from './components/Preview'
import { About } from './components/About'
import { SideNav, NavButton } from './components/Nav'
import DND from './D&D'
import C from './constants'
import './App.css'


/* ==============================================================================================
    SHOW/HIDE NAVBAR ON WINDOW RESIZE
============================================================================================== */

window.onresize = () => {
  const el = document.querySelector('.navbar')
  const tog = document.querySelector('#navi-toggle')
  tog.checked = (window.innerWidth >= 720)
  el.style.left = (window.innerWidth < 720) ? '-200px' : '5px'
}


/* ==============================================================================================
    MAIN APP COMPONENT (ROOT COMPONENT)
============================================================================================== */
  
export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      abilities: [],
      allCharacters: [],
      campaign: 1,
      appData: {},
      character: {},
      currentPage: 'home',
      equipSection: 'main',
      favoredEnemy: null,
      featList: false,
      featsValidated: [false, false, false],
      features: {},
      loading: false,
      loadingText: '',
      moreFeatures: false,
      openConfirm: false,
      openInfo: false,
      openValidate: false,
      overspent: false,
      points: new Array(6).fill(0),
      scores: new Array(6).fill(8),
      selectedFeats: [null, null, null],
      selectedCantrips: [],
      selectedSpells: [],
      skillRanks: [],
      selectedClass: null,
      selectedEquipment: {
        armor: [],
        weapons: [],
        gear: []
      },
      selectedRace: null,
      spentSkillPoints: 0,
      workingCharacter: {}
    }

  }


  // SET THE NAVBAR DISPLAY
  setNavbarDisplay() {
    document.querySelector('#navi-toggle').checked = (window.innerWidth >= 720)
    this.refs._navbar.style.left = (window.innerWidth < 720) ? '-200px' : '5px'
  }


  // GET ALL THE DATA USED BY THE APP AND CHECK NAVBAR DISPLAY
  componentDidMount() {
    // show or hide the navbar
    this.setNavbarDisplay()

    // retrieve all the app data from the server/db
    fetch('/api/data')
      .then(res => res.json())
      .then(json => {
        // create an array of basic skill objects
        const charSkills = []
        json.skills.forEach(skill => {
          charSkills.push({ 
            name: skill.name, 
            ranks: 0 
          })
        })
        // add data to state
        this.setState({ 
          appData: json,
          skillRanks: charSkills 
        })
      })
  }


  // SET THE STATE OF THE APPLICATION
  setAppState(newState) {
    this.setState({ ...newState })
  }


  // SET THE STATE TO THE CORRECT PAGE WHEN NAV ITEM IS CLICKED
  navClick(e) {
    const page = e.target.id
    this.setState({ currentPage: page })
  }


  // SAVE THE CURRENT CHARACTER INSTANCE TO THE DATABASE,
  // THEN SET THE WORKING CHARACTER TO THAT INSTANCE
  saveCharacter(character, page) {
    fetch(
      `/api/character/${character._id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(character),
        headers: { 'Content-Type': 'application/json'}
      }
    )
    .then(res => res.json())
    .then(json => {
      const selected = DND.setSelectedFeats(json)
      const val = [
        false, 
        (json.race === 'human') ? false : true, 
        (json.class === 'fighter') ? false : true,
      ]
      this.setAppState({ 
        workingCharacter: json,
        loading: false,
        currentPage: page,
        selectedFeats: selected,
        featsValidated: val
      })
    })
  }


  // SHOW/HIDE THE NAVBAR WHEN NAVBRAND IS CLICKED
  showNavbar() {
    let { left } = this.refs._navbar.style
    this.refs._navbar.style.left = (left === '-200px') ? '5px' : '-200px'
    document.querySelector('#navi-toggle').checked = (left === '5px')
  }


  // SHOW THE NAVBAR DISPLAY WHEN COMPONENT UPDATES
  componentDidUpdate() {
    this.setNavbarDisplay()
    console.log(this.props.workingCharacter)
  }


  // RENDER THE COMPONENT
  render() {
    // props for the SideNav component
    const navHandlers = { 
      click: this.navClick.bind(this),
      page: this.state.currentPage,
    }
    
    // props for every page
    const pageProps = {
      setAppState: this.setAppState.bind(this),
      workingCharacter: this.state.workingCharacter,
      saveCharacter: this.saveCharacter.bind(this),
      openConfirm: this.state.openConfirm,
      openValidate: this.state.openValidate,
      loading: this.state.loading,
      loadingText: this.state.loadingText
    }

    // props for First page
    const firstProps = {
      allCharacters: this.state.allCharacters,
      character: this.state.character,
      ...pageProps
    }

    // props for the Class page
    const classProps = {
      selectedClass: this.state.selectedClass,
      descriptions: this.state.appData.descriptions,
      classes: this.state.appData.classes,
      ...pageProps
    }

    // props for the Race page
    const raceProps = {
      selectedRace: this.state.selectedRace,
      personalities: this.state.appData.personalities,
      races: this.state.appData.races,
      ...pageProps
    }

    // props for the Abilites page
    const abilityProps = {
      campaign: this.state.campaign,
      scores: this.state.scores,
      points: this.state.points,
      overspent: this.state.overspent,
      campaigns: this.state.appData.campaigns,
      abilities: this.state.appData.abilities,
      ...pageProps
    }

    // props for the Features page
    const featureProps = {
      favoredEnemies: this.state.appData.favoredEnemies,
      bardSpells: this.state.appData.bardSpells,
      sorcererSpells: this.state.appData.sorcererSpells,
      deities: this.state.appData.deities,
      moreFeatures: this.state.moreFeatures,
      favoredEnemy: this.state.favoredEnemy,
      features: this.state.features,
      selectedCantrips: this.state.selectedCantrips,
      selectedSpells: this.state.selectedSpells,
      ...pageProps
    }

    // props for the Skills page
    const skillProps = {
      skills: this.state.appData.skills,
      spentSkillPoints: this.state.spentSkillPoints,
      skillRanks: this.state.skillRanks,
      ...pageProps
    }

    // props for the Feats page
    const featProps = {
      feats: this.state.appData.feats,
      featList: this.state.featList,
      selectedFeats: this.state.selectedFeats,
      featsValidated: this.state.featsValidated,
      ...pageProps
    }

    // props for the Equipment page
    const equipProps = {
      equipSection: this.state.equipSection,
      weapons: this.state.appData.weapons,
      armor: this.state.appData.armor,
      gear: this.state.appData.equipment,
      selectedEquipment: this.state.selectedEquipment,
      ...pageProps
    }

    // set the currently displayed page based on the state's currentPage property
    const getCurrentPage = () => {
      switch (this.state.currentPage) {
        case 'home':
          return <Home/>
        case 'first':
          return <FirstSteps {...firstProps}/>
        case 'class':
          return <Class {...classProps}/>
        case 'race':
          return <Race {...raceProps}/>
        case 'abilities':
          return <AbilityMain {...abilityProps}/>
        case 'features':
          return <Features {...featureProps}/>
        case 'skills':
          return <Skills {...skillProps}/>
        case 'feats':
          return <Feats {...featProps}/>
        case 'equipment':
          return <Equipment {...equipProps}/>
        case 'preview':
          return <Preview {...pageProps}/>
        case 'about':
          return <About/>
        default:
          return <Home {...pageProps}/>
      }
    }


    // GET INFO DIALOG BODY
    const infoBody = () => {
      const { appData, currentPage } = this.state
      return appData.appInfo[currentPage].map(info => <li className="info-detail">{info}</li>)
    }


    // RETURN JSX
    return (
      <div>
        <div className="navbrand-hex" onClick={() => this.setState({ currentPage: 'home' })}>
          &#9108;
          <h1 className="navbrand-text">SF</h1>
        </div>

        <NavButton changeNav={this.showNavbar.bind(this)} />
        
        {this.state.workingCharacter 
          ? <h2 className="charName">{this.state.workingCharacter.name}</h2> 
          : null
        }
        
        <div className="navbar" ref="_navbar">
          <div className="nav">
            <div className="nav-inner">
              <ul className="header">
                {C.ROUTES.map((route, i) => 
                  <SideNav key={i} id={route.name} {...navHandlers}>{route.text}</SideNav>
                )}
              </ul>
            </div>   
          </div>
        </div>

        <div className="content">
          {getCurrentPage()}
        </div>

        <div id="info-btn" onClick={() => this.setState({ openInfo: true })} />
        {this.state.openInfo
          ? <Dialog 
              modal={true}
              info={true}
              hasCancel={false}
              header="Information"
              onAction={() => this.setState({ openInfo: false })}
            >
              <ul className="info-list">
                {infoBody()}
              </ul>
            </Dialog>
          : null}
      </div>
    )
  }
}