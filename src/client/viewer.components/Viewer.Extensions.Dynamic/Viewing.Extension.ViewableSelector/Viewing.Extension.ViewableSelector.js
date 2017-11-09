/////////////////////////////////////////////////////////
// Viewing.Extension.ViewableSelector
// by Philippe Leefsma, November 2017
//
/////////////////////////////////////////////////////////
import MultiModelExtensionBase from 'Viewer.MultiModelExtensionBase'
import './Viewing.Extension.ViewableSelector.scss'
import WidgetContainer from 'WidgetContainer'
import ReactTooltip from 'react-tooltip'
import ServiceManager from 'SvcManager'
import Toolkit from 'Viewer.Toolkit'
import ReactDOM from 'react-dom'
import Image from 'Image'
import Label from 'Label'
import React from 'react'

class ViewableSelectorExtension extends MultiModelExtensionBase {

  /////////////////////////////////////////////////////////
  // Class constructor
  //
  /////////////////////////////////////////////////////////
  constructor (viewer, options) {

    super (viewer, options)

    this.react = options.react
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  get className() {

    return 'viewable-selector'
  }

  /////////////////////////////////////////////////////////
  // Extension Id
  //
  /////////////////////////////////////////////////////////
  static get ExtensionId() {

    return 'Viewing.Extension.ViewableSelector'
  }

  /////////////////////////////////////////////////////////
  // Load callback
  //
  /////////////////////////////////////////////////////////
  load () {

    this.react.setState({

      activeItem: null,
      items: []

    }).then (async() => {

      this.createButton()

      const urn = this.options.model.urn

      this.viewerDocument =
        await this.options.loadDocument(urn)

      const items =
        await Toolkit.getViewableItems(
          this.viewerDocument)

      if (items.length > 1) {

        if (this.options.showPanel) {

          this.showPanel (true)
        }

        this.react.setState({
          activeItem: items[0],
          items
        })
      }
    })

    console.log('Viewing.Extension.ViewableSelector loaded')

    return true
  }

  /////////////////////////////////////////////////////////
  // Unload callback
  //
  /////////////////////////////////////////////////////////
  unload () {

    this.react.popViewerPanel(this)

    console.log('Viewing.Extension.ViewableSelector unloaded')

    return true
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  onItemSelected (item) {

    const {activeItem} = this.react.getState()

    if (item.guid !== activeItem.guid) {

      this.viewer.tearDown()

      this.viewer.start()

      const path =
        this.viewerDocument.getViewablePath(item)

      this.viewer.loadModel(path)

      this.react.setState({
        activeItem: item
      })
    }
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  createButton () {

    this.button = document.createElement('button')

    this.button.title = 'This model has multiple views ...'

    this.button.className = 'viewable-selector btn'

    this.button.innerHTML = 'Views'

    this.button.onclick = () => {

      this.showPanel(true)
    }

    const span = document.createElement('span')

    span.className = 'fa fa-list-ul'

    this.button.appendChild(span)

    this.viewer.container.appendChild(this.button)
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  showPanel (show) {

    if (show) {

      this.button.classList.add('active')

      const container = this.viewer.container

      this.react.pushViewerPanel(this, {
        maxHeight: container.offsetHeight - 110,
        height: container.offsetHeight - 110,
        draggable: false,
        maxWidth: 500,
        minWidth: 310,
        width: 310,
        top: 30
      })

    } else {

      this.react.popViewerPanel(this.id).then(() => {

        this.button.classList.remove('active')
      })
    }
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  renderContent () {

    const {activeItem, items} = this.react.getState()

    const urn = this.options.model.urn

    const apiUrl = this.options.apiUrl

    const domItems = items.map((item) => {

      const active = (item.guid === activeItem.guid)
        ? ' active' :''

      const query = `size=400&guid=${item.guid}`

      const src = `${apiUrl}/thumbnails/${urn}?${query}`

      return (
        <div key={item.guid} className={"item" + active}
          onClick={() => this.onItemSelected(item)}>
          <div className="image-container"
            data-for={`thumbnail-${item.guid}`}
            data-tip>
            <Image src={src}/>
          </div>
          <ReactTooltip id={`thumbnail-${item.guid}`}
            className="tooltip-thumbnail"
            delayShow={700}
            effect="solid"
            place="right">
            <div>
              <img src={src} height="200"/>
            </div>
          </ReactTooltip>
          <Label text={item.name}/>
        </div>
      )
    })

    return (
      <div className="items">
        {domItems}
        <div style={{height: '80px'}}/>
      </div>
    )
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  renderTitle () {

    return (
      <div className="title">
        <label>
          Select Viewable
        </label>
        <div className="viewable-selector-controls">
          <button onClick={() => this.showPanel(false)}
            title="Toggle panel">
            <span className="fa fa-times"/>
          </button>
        </div>
      </div>
    )
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  render (opts) {

    return (
      <WidgetContainer
        renderTitle={() => this.renderTitle(opts.docked)}
        showTitle={opts.showTitle}
        className={this.className}>
        {this.renderContent()}
      </WidgetContainer>
    )
  }
}

Autodesk.Viewing.theExtensionManager.registerExtension(
  ViewableSelectorExtension.ExtensionId,
  ViewableSelectorExtension)
