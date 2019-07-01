import React, { Component, Children, cloneElement } from 'react'

const style = {
  minWidth: '100%',
  position: 'relative'
}

export default class FileThemeTreeNodeRenderer extends Component {
  render() {
    const {
      children,
      listIndex,
      swapFrom = null,
      swapLength = null,
      swapDepth = null,
      scaffoldBlockPxWidth,
      lowerSiblingCounts,
      connectDropTarget,
      isOver,
      draggedNode = null,
      canDrop = false,
      treeIndex,
      treeId, // Delete from otherProps
      getPrevRow, // Delete from otherProps
      node, // Delete from otherProps
      path, // Delete from otherProps
      rowDirection,
      ...otherProps
    } = this.props

    return connectDropTarget(
      <div {...otherProps} style={style}>
        {Children.map(children, child =>
          cloneElement(child, {
            isOver,
            canDrop,
            draggedNode,
            lowerSiblingCounts,
            listIndex,
            swapFrom,
            swapLength,
            swapDepth
          })
        )}
      </div>
    )
  }
}
