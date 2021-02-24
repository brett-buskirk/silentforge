import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form } from '../FormControls'


/* ==============================================================================================
    BASIC FEATURES COMPONENT
============================================================================================== */

export default class BasicFeatures extends Component {

  // PROP TYPES
  static propTypes = {
    wc: PropTypes.object.isRequired,
    deities: PropTypes.arrayOf(PropTypes.object).isRequired,
    features: PropTypes.object
  }


  // GET THE FORM DATA
  getData() {
    return this.refs.form.getData()
  }


  // GET ALLOWED ALIGNMENTS
  getAlignments() {
    return this.props.wc.allowedAlignments.map(align => {
      return { name: align, _id: align }
    })
  }


  // GET LIST OF DEITIES
  getDeities() {
    return this.props.deities.map(deity => {
      return { name: deity.name, _id: deity.name }
    })
  }


  // RENDER THE COMPONENT
  render() {
    const { wc, features } = this.props
    const len = Object.keys(features).length

    // RETURN JSX
    return (
      <Form
        id="frm-features" 
        ref="form"
        fields={[
          {id: 'name', label: 'Name', ref: 'name', placeholder: 'character name...'},
          {type: 'select', id: 'alignment', label: 'Alignment', options: this.getAlignments()},
          {type: 'select', id: 'deity', label: 'Deity', options: this.getDeities()},
          {type: 'select', id: 'gender', label: 'Gender', options: [{ name: 'male', _id: 'male'}, { name: 'female', _id: 'female' }]},
          {type: 'number', id: 'age', label: 'Age', placeholder: 'age...'},
          {id: 'height', label: 'Height', placeholder: 'height...'},
          {id: 'weight', label: 'Weight', placeholder: 'weight...'},
          {id: 'skin', label: 'Skin', placeholder: 'skin description...'},
          {id: 'hair', label: 'Hair', placeholder: 'hair color/length...'},
          {id: 'eyes', label: 'Eyes', placeholder: 'eye color...'},
          {id: 'description', label: 'Description', placeholder: 'physical description...'},
          {id: 'personality', label: 'Personality', placeholder: 'character personality...'},
          {id: 'background', label: 'Background', placeholder: 'character background...'},
        ]}
        initialData={{
          name: len ? features.name : wc.name,
          alignment: len ? features.alignment : wc.details.alignment,
          deity: len ? features.deity : wc.details.deity,
          gender: len ? features.gender : wc.details.gender,
          age: len ? features.age : wc.details.age,
          height: len ? features.height : wc.details.height,
          weight: len ? features.weight : wc.details.weight,
          skin: len ? features.skin : wc.details.skin,
          hair: len ? features.hair : wc.details.hair,
          eyes: len ? features.eyes : wc.details.eyes,
          description: len ? features.description : wc.details.description,
          personality: len ? features.personality : wc.details.personality,
          background: len ? features.background : wc.details.background
        }}/>
    )
  }
}