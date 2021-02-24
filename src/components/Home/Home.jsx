import React from 'react';
import { PageWrap } from '../Utilities'
import './home.css'


/* ==============================================================================================
    HOME PAGE
============================================================================================== */

export default function Home() {

  // RETURN JSX
  return (
    <PageWrap image="home">
      <div className="homeMain">
        <h1>Welcome to the SilentForge</h1>
        <h1>Character Creation Engine</h1>
        <h3>Create 3.5 Dungeons &amp; Dragons characters!</h3>
      </div>
      <h2 className="info-pointer">Info Here &rArr;</h2>
    </PageWrap>
  )
}