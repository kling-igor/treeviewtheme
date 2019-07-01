import React, { Component } from 'react'
import styled from 'styled-components'

const styles = {
  root: {
    height: '100%'
  },
  row: {
    display: 'flex'
  }
}

// Line-overlaid blocks used for showing the tree structure
const LineBlockStyle = styled.div`
  height: 100%;
  position: relative;
  display: inline-block;
  flex: 0 0 auto;
  width: ${({ scaffoldWidth }) => `${scaffoldWidth}px`};
`

const AbsoluteLineBlockStyle = styled(LineBlockStyle)`
  position: absolute;
  top: 0;
`

const ARROW_SIZE = '7'
const HIGHLIGHT_COLOR = '#36c2f6'
const HIGHLIGHT_LINE_SIZE = '6' // Make it an even number for clean rendering

const BORDER_STYLE = `solid ${HIGHLIGHT_LINE_SIZE}px ${HIGHLIGHT_COLOR}`

/**
 * +--+--+
 * |  |  |
 * |  |  |
 * |  +->|
 * +-----+
 */
const HighlightBottomLeftCornerStyle = styled(AbsoluteLineBlockStyle)`
  z-index: 3;

  &::before {
    content: '';
    position: absolute;
    border-bottom: ${BORDER_STYLE};
    border-left: ${BORDER_STYLE};
    box-sizing: border-box;
    width: ${() => `calc(50% - ${ARROW_SIZE - HIGHLIGHT_LINE_SIZE / 2}px)`};
    height: ${() => `calc(100% + ${HIGHLIGHT_LINE_SIZE / 2}px)`};
    top: 0;
    right: ${`${ARROW_SIZE}px`};
  }

  &::after {
    content: '';
    position: absolute;
    height: 0;
    right: 0;
    top: 100%;
    margin-top: ${`${-1 * ARROW_SIZE}px`};
    border-top: ${`${ARROW_SIZE}px solid transparent`};
    border-bottom: ${`${ARROW_SIZE}px solid transparent`};
    border-left: ${`${ARROW_SIZE}px solid ${HIGHLIGHT_COLOR}}`};
  }
`

/**
 * +-----+
 * |     |
 * |  +--+
 * |  |  |
 * +--+--+
 */
const HighlightTopLeftCornerStyle = styled(AbsoluteLineBlockStyle)`
  &::before {
    z-index: 3;
    content: '';
    position: absolute;
    border-top: ${BORDER_STYLE};
    border-left: ${BORDER_STYLE};
    box-sizing: border-box;
    width: ${`calc(50% + ${HIGHLIGHT_LINE_SIZE / 2}px)`};
    height: ${`calc(50% + ${HIGHLIGHT_LINE_SIZE / 2}px)`};
    top: 50%;
    margin-top: ${`${HIGHLIGHT_LINE_SIZE / -2}px`};
    right: 0;
  }
`

/**
 * +--+--+
 * |  |  |
 * |  |  |
 * |  |  |
 * +--+--+
 */
const HighlightLineVerticalStyle = styled(AbsoluteLineBlockStyle)`
  z-index: 3;

  &::before {
    position: absolute;
    content: '';
    background-color: ${HIGHLIGHT_COLOR};
    width: ${`${HIGHLIGHT_LINE_SIZE}px`};
    margin-left: ${`${HIGHLIGHT_LINE_SIZE / -2}px`};
    left: 50%;
    top: 0;
    height: 100%;
  }

  @keyframes arrow-pulse {
    0% {
      transform: translate(0, 0);
      opacity: 0;
    }
    30% {
      transform: translate(0, 30% * 10);
      opacity: 1;
    }
    70% {
      transform: translate(0, 70% * 10);
      opacity: 1;
    }
    100% {
      transform: translate(0, 100% * 10);
      opacity: 0;
    }
  }

  &::after {
    content: '';
    position: absolute;
    height: 0;
    margin-left: ${`${-HIGHLIGHT_LINE_SIZE / 2}px`};
    left: 50%;
    top: 0;
    border-left: ${`${HIGHLIGHT_LINE_SIZE / 2}px solid transparent`};
    border-right: ${`${HIGHLIGHT_LINE_SIZE / 2}px solid transparent`};
    border-top: ${`${HIGHLIGHT_LINE_SIZE / 2}px solid white`};
    animation: arrow-pulse 1s infinite linear both;
  }
`

const NodeArrowStyle = styled.span`
  /* padding: 0; */
  z-index: 2;
  /* position: absolute; */
  /* top: 45%; */
  /* width: 30px; */
  width: 20px;
  background-color: green;

  /* color: ${({ theme: { type } }) => (type === 'dark' ? 'white' : 'black')}; */
  color: black;
  /* margin-right: 6px; */
  display: inline-block;
  transform: ${({ ellapsed }) => (ellapsed ? 'rotate(-45deg)' : 'rotate(-90deg)')};
  transition: transform 200ms cubic-bezier(0.4, 1, 0.75, 0.9);

  ::after {
    content: '▾';
  }
`

const CollapseButtonStyle = styled.button`
  appearance: none;
  border: none;
  background: transparent;
  padding: 0;
  z-index: 2;
  position: absolute;
  top: 45%;
  width: 30px;
  height: 30px;
  transform: translate3d(-50%, -50%, 0);
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    transform-origin: 7px 4px;
    transform: translate3d(-50%, -20%, 0);
    border: solid transparent 10px;
    border-left-width: 7px;
    border-right-width: 7px;
    border-top-color: gray;
  }

  &:hover::after {
    border-top-color: black;
  }

  &:focus {
    outline: none;

    /* &::after {
      filter: drop-shadow(0 0 1px #83bef9) drop-shadow(0 0 1px #83bef9) drop-shadow(0 0 1px #83bef9);
    } */
  }
`

const ExpandButtonStyle = styled(CollapseButtonStyle)`
  &::after {
    transform: translate3d(-50%, -20%, 0) rotateZ(-90deg);
  }
`

const RowStyle = styled.div`
  height: 100%;
  white-space: nowrap;
  display: flex;
  position: relative;

  & > * {
    box-sizing: border-box;
  }
`

// The outline of where the element will go if dropped, displayed while dragging
const RowLandigPadStyle = styled(RowStyle)`
  border: none;
  box-shadow: none;
  outline: none;

  * {
    opacity: 0 !important;
  }

  &::before {
    background-color: ${({ canDrop }) => (canDrop ? 'lightblue' : '#e6a8ad')};
    border: 1px dotted black;
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
  }
`

const RowWrapperStyle = styled.div`
  height: 100%;
  box-sizing: border-box;
  cursor: ${({ canDrag }) => (canDrag ? 'move' : 'default')};

  &:hover {
    opacity: 0.7;
  }

  &:active {
    opacity: 1;
  }
`

const RowItemStyle = styled.div`
  display: inline-block;
  vertical-align: middle;
`

const RowContentsStyle = styled(RowItemStyle)`
  position: relative;
  height: 100%;
  flex: 1 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const RowLabelStyle = styled(RowItemStyle)`
  flex: 0 1 auto;
  padding-right: 20px;
`

const RowToolbarStyle = styled(RowItemStyle)`
  flex: 0 1 auto;
  display: flex;
`

const RowToolbarButtonStyle = styled(RowItemStyle)``

function isDescendant(older, younger) {
  return (
    !!older.children &&
    typeof older.children !== 'function' &&
    older.children.some(child => child === younger || isDescendant(child, younger))
  )
}

// eslint-disable-next-line react/prefer-stateless-function
export default class FileThemeNodeContentRenderer extends Component {
  render() {
    const {
      scaffoldBlockPxWidth,
      toggleChildrenVisibility = null,
      connectDragPreview,
      connectDragSource,
      isDragging,
      canDrop = false,
      canDrag = false,
      node,
      title = null,
      draggedNode = null,
      path,
      treeIndex,
      isSearchMatch = false,
      isSearchFocus = false,
      icons = [],
      buttons,
      className = '',
      style = {},
      didDrop,
      lowerSiblingCounts,
      listIndex,
      swapFrom = null,
      swapLength = null,
      swapDepth = null,
      treeId, // Not needed, but preserved for other renderers
      isOver, // Not needed, but preserved for other renderers
      parentNode = null, // Needed for dndManager
      rowDirection,
      ...otherProps
    } = this.props

    const nodeTitle = title || node.title

    const isDraggedDescendant = draggedNode && isDescendant(draggedNode, node)
    const isLandingPadActive = !didDrop && isDragging

    // Construct the scaffold representing the structure of the tree
    const scaffold = []
    lowerSiblingCounts.forEach((lowerSiblingCount, i) => {
      scaffold.push(<LineBlockStyle key={`pre_${1 + i}`} scaffoldWidth={scaffoldBlockPxWidth} />)

      if (treeIndex !== listIndex && i === swapDepth) {
        // This row has been shifted, and is at the depth of
        // the line pointing to the new destination
        let HighlightLineClass

        if (listIndex === swapFrom + swapLength - 1) {
          // This block is on the bottom (target) line
          // This block points at the target block (where the row will go when released)
          HighlightLineClass = HighlightBottomLeftCornerStyle
        } else if (treeIndex === swapFrom) {
          // This block is on the top (source) line
          HighlightLineClass = HighlightTopLeftCornerStyle
        } else {
          // This block is between the bottom and top
          HighlightLineClass = HighlightLineVerticalStyle
        }

        scaffold.push(
          <HighlightLineClass
            key={`highlight_${1 + i}`}
            style={{
              width: scaffoldBlockPxWidth,
              left: scaffoldBlockPxWidth * i
            }}
          />
        )
      }
    })

    const nodeContent = () => {
      // let Button = null

      // if (toggleChildrenVisibility && node.children && node.children.length > 0) {
      //   Button = node.expanded ? CollapseButtonStyle : ExpandButtonStyle
      // }

      const Row = isLandingPadActive ? RowLandigPadStyle : RowStyle

      return (
        <div style={styles.root} {...otherProps}>
          {toggleChildrenVisibility && node.children && node.children.length > 0 && (
            // <Button
            //   aria-label={node.expanded ? 'Collapse' : 'Expand'}
            //   style={{
            //     left: (lowerSiblingCounts.length - 0.7) * scaffoldBlockPxWidth
            //   }}
            //   onClick={() =>
            //     toggleChildrenVisibility({
            //       node,
            //       path,
            //       treeIndex
            //     })
            //   }
            // />
            <NodeArrowStyle
              ellapsed={node.expanded}
              style={{
                left: (lowerSiblingCounts.length - 0.7) * scaffoldBlockPxWidth
              }}
              onClick={() =>
                toggleChildrenVisibility({
                  node,
                  path,
                  treeIndex
                })
              }
            />
          )}

          <RowWrapperStyle canDrag={canDrag}>
            {/* Set the row preview to be used during drag and drop */}
            {connectDragPreview(
              <div style={styles.row}>
                {scaffold}
                <Row
                  canDrop={canDrop}
                  style={{
                    opacity: isDraggedDescendant ? 0.5 : 1,
                    ...style
                  }}
                >
                  <RowContentsStyle>
                    <RowToolbarStyle>
                      {icons.map((icon, index) => (
                        <RowToolbarButtonStyle
                          key={index} // eslint-disable-line react/no-array-index-key
                        >
                          {icon}
                        </RowToolbarButtonStyle>
                      ))}
                    </RowToolbarStyle>
                    <RowLabelStyle>
                      <span>
                        {typeof nodeTitle === 'function'
                          ? nodeTitle({
                              node,
                              path,
                              treeIndex
                            })
                          : nodeTitle}
                      </span>
                    </RowLabelStyle>

                    {/* <div className={styles.rowToolbar}>
                    {buttons.map((btn, index) => (
                      <div
                        key={index} // eslint-disable-line react/no-array-index-key
                        className={styles.toolbarButton}
                      >
                        {btn}
                      </div>
                    ))}
                  </div> */}
                  </RowContentsStyle>
                </Row>
              </div>
            )}
          </RowWrapperStyle>
        </div>
      )
    }

    return canDrag ? connectDragSource(nodeContent(), { dropEffect: 'copy' }) : nodeContent()
  }
}
