import React from 'react'
import { PageWrap } from '../Utilities'
import './About.css'


/* ==============================================================================================
    ABOUT PAGE
============================================================================================== */

export default function About() {

  // RETURN JSX
  return (
    <PageWrap image="about">
      <div id="about-container">
        <div id="about-img" />
        <div id="about-block">
          <h3>Brett "Buzz" Buskirk</h3>
          <p>
            <span>SilentForge</span> was created by Buzz, an avid RPG player and GM for many years.
            His favorite part of gaming has always been the creation of characters and NPCs. As a result,
            he built this website to ease the process of character generation and to make it more fun 
            and enjoyable. He hopes to expand the website in the future, with the intention of adding 
            features from his <span>SilentForge</span> campaign setting.
          </p>
        </div>
      </div>
    </PageWrap>
  )
}