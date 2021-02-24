import React from 'react'
import PropTypes from 'prop-types'
import { CampaignPoints } from '../AbilityScores'
import { BorderWrap } from '../Utilities'


/* ==============================================================================================
    CAMPAIGN POINTS CONTAINER
============================================================================================== */

export default function CampaignPointsContainer({ curCampaign, setCurCampaign, campaigns }) {

  // RETURN JSX
  return (
    <div className="campaignPoints">
      <BorderWrap size="small">
        <h2 className="campaignTitle">Campaign Points</h2>
        <CampaignPoints 
          curCampaign={curCampaign}
          setCurCampaign={setCurCampaign}
          campaigns={campaigns} />
      </BorderWrap>
    </div>
  )
}


// PROP TYPES
CampaignPointsContainer.propTypes = {
  curCampaign: PropTypes.number.isRequired,
  setCurCampaign: PropTypes.func.isRequired,
  campaigns: PropTypes.arrayOf(PropTypes.object).isRequired
}