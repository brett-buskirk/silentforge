import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '../FormControls'


/* ==============================================================================================
    FEATURE BUTTON GROUP COMPONENT
============================================================================================== */

export default function FeatureButtonGroup(props) {

  // SET VIEW OF FEATURES TO SHOW MORE FEATURES OR LESS
  const changeViews = () => {
    if (!props.moreFeatures) props.setFeatures()
    props.setAppState({ moreFeatures: !props.moreFeatures })
  }


  // DETERMINE WHETHER OR NOT THE CLASS HAS EXTRA FEATURES
  const featuredClass = ['bard', 'ranger', 'sorcerer'].includes(props.charClass)


  // RETURN JSX
  return (
    <div className="btn-group">
      {featuredClass 
        ? <Button 
            id="more-features" 
            className="btn-metal"
            onClick={() => changeViews()}>
              {props.moreFeatures ? 'Back' : 'More...'}
          </Button>
        : null}
      {!props.moreFeatures
        ? <Button 
            id="save-features" 
            className="btn-metal"
            onClick={() => props.confirm()}>
              Save Details
          </Button>
        : null}
    </div>
  )
}


// PROP TYPES
FeatureButtonGroup.propTypes = {
  moreFeatures: PropTypes.bool.isRequired,
  setAppState: PropTypes.func.isRequired,
  charClass: PropTypes.string,
  confirm: PropTypes.func.isRequired,
  setFeatures: PropTypes.func.isRequired
}