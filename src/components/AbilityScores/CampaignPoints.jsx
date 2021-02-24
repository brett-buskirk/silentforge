import React from 'react'
import PropTypes from 'prop-types'


/* ==============================================================================================
    CAMPAIGN POINTS SELECTION TABLE COMPONENT
============================================================================================== */

export default function CampaignPoints({ curCampaign, setCurCampaign, campaigns }) {

  // RETURN JSX
  return (
    <table className="campaignTable">
      <thead>
        <tr>
          <th></th>
          <th>Campaign</th>
          <th>Points</th>
        </tr>
      </thead>
      <tbody>{
        campaigns.map((item, i) => {
        const checked = (curCampaign === i) ? <span>&#9734;</span> : ''
          return (
            <tr key={i} onClick={() => setCurCampaign({ campaign: i })}>
              <td key={`${i}0`}>{checked}</td>
              <td key={`${i}1`}>{item.type}</td>
              <td key={`${i}2`}>{item.points}</td>
            </tr>
          )
        })
      }</tbody>
    </table>
  )
}


// PROP TYPES
CampaignPoints.propTypes = {
  curCampaign: PropTypes.number.isRequired,
  setCurCampaign: PropTypes.func.isRequired,
  campaigns: PropTypes.arrayOf(PropTypes.object).isRequired
}