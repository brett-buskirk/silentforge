import React from 'react'
import PropTypes from 'prop-types'
import { AutoFill } from '../FormControls'


/* ==============================================================================================
    FEAT SELECTOR COMPONENT
============================================================================================== */

export default function FeatSelector(props) {

  // RETURN A LIST OF ALL FILTERED FEATS
  const featList = () => {
    const { allFeats } = props

    // create array of feat objects from allFeats object
    let list = []
    for (let feat in allFeats) {
      list.push({ 
        name: feat, 
        description: allFeats[feat].description, 
        pre: allFeats[feat].pre,
        ftr: allFeats[feat].ftr
      })
    }
    
    // filter list for already selected feats
    list = list.filter(feat => !props.selected.includes(feat.name))

    // filter fighter feats if appropriate
    return props.id === 'ftr' ? list.filter(feat => feat.ftr) : list
  }


  // RETURN JSX
  return (
    <>
      <h3 className="featLabel">{props.title}</h3>
      <div className="featGroup">
        <AutoFill 
          id={props.id} 
          setFeat={props.changeFeat}
          defaultValue={props.defaultValue} 
          options={featList()}/>
        {props.val
          ? <h3 className="val validated">&#10003;</h3> 
          : <h3 className="val unvalidated">X</h3>}
      </div>
    </>
  )
}


// PROP TYPES
FeatSelector.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  val: PropTypes.bool.isRequired,
  changeFeat: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
  allFeats: PropTypes.object.isRequired,
  selected: PropTypes.arrayOf(PropTypes.string)
}