import React, { Component } from 'react'
import classNames from 'classnames'
import Button from '../FormControls/Button'
import PropTypes from 'prop-types'
import './dialog.css'


/* ==============================================================================================
    DIALOG COMPONENT
============================================================================================== */

export default class Dialog extends Component {

  // PROP TYPES
  static propTypes = {
    header: PropTypes.string.isRequired,
    confirmLabel: PropTypes.string,
    modal: PropTypes.bool,
    onAction: PropTypes.func,
    hasCancel: PropTypes.bool,
    info: PropTypes.bool
  }


  // DEFAULT PROP VALUES
  static defaultProps = {
    confirmLabel: 'ok',
    modal: false,
    onAction: () => {},
    hasCancel: true,
    info: false
  }


  // REMOVE CLASS DialogModalOpen WHEN COMPONENT UNMOUNTS
  componentWillUnmount() {
    document.body.classList.remove('DialogModalOpen')
  }


  // ADD CLASS DialogModalOpen WHEN COMPONENT MOUNTS
  componentDidMount() {
    document.body.classList.add('DialogModalOpen')
  }


  // RENDER THE COMPONENT
  render() {
    return (
      <div className={classNames({
        'Dialog': true,
        'DialogModal': this.props.modal,
        'Info' : this.props.info
        })}>
        <div className={classNames({ 'DialogModalWrap': this.props.modal })}>
          <div className="DialogHeader">{this.props.header}</div>
          <div className="DialogBody">{this.props.children}</div>
          <div className="DialogFooter">
            {this.props.hasCancel
              ? <span
                  className="DialogDismiss"
                  onClick={this.props.onAction.bind(this, 'dismiss')}>
                  Cancel
                </span>
              : null
            }
            <Button className="btn-metal" onClick={this.props.onAction.bind(this, 
              this.props.hasCancel ? 'confirm' : 'dismiss')}>
              {this.props.confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    )
  }
}