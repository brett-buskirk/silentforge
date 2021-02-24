import React from 'react'
import PropTypes from 'prop-types'
import './AutoFill.css'


/* ==============================================================================================
    AUTOFILL COMPONENT
============================================================================================== */

export default function AutoFill(props) {

  // CHECK TO MAKE SURE FEAT EXISTS, OR NULL VALUE IS ENTERED
  const checkFeat = (e) => {
    const feats = props.options.map(feat => feat.name)
    if (feats.includes(e.target.value) || e.target.value === '') {
      props.setFeat([{ name: e.target.value, type: props.id }])
    }
  }


  // CHECK FEAT'S EXISTENCE WHEN LEAVE INPUT AREA
  const checkOut = (e) => {
    const feats = props.options.map(feat => feat.name)
    if (!feats.includes(e.target.value)) {
      props.setFeat([{ name: e.target.value, type: props.id }])
    }
  }
  

  // ASSIGN RANDOM ID TO CONNECT INPUT AND DATALIST ELEMENTS
  const randomid = Math.random().toString(16).substring(2)


  // MAP THE OPTION ELEMENTS
  const optionList = props.options.map((item, i) => {
    return <option className="featOption" value={item.name} key={i}>{item.description}</option>
  })


  // RETURN JSX
  return (
    <div className="AutoFill">
      <input
        id={props.id}
        list={randomid}
        placeholder="Feat"
        defaultValue={props.defaultValue}
        onChange={e => checkFeat(e)}
        onBlur={e => checkOut(e)}
        />
      <datalist id={randomid}>{optionList}</datalist>
    </div>
  )
}


// PROP TYPES
AutoFill.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  defaultValue: PropTypes.string,
  setFeat: PropTypes.func,
  id: PropTypes.string
}