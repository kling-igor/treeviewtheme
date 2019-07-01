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

const ARROW_SIZE = 6
const HIGHLIGHT_COLOR = '#36c2f6'
const HIGHLIGHT_LINE_SIZE = 4 // Make it an even number for clean rendering

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
    width: ${() => `calc(60% - ${ARROW_SIZE - HIGHLIGHT_LINE_SIZE / 2}px)`};
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
    width: ${`calc(60% + ${HIGHLIGHT_LINE_SIZE / 2}px)`};
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
    left: 40%;
    top: 0;
    height: 100%;
  }

  /* @keyframes arrow-pulse {
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
    left: 40%;
    top: 0;
    border-left: ${`${HIGHLIGHT_LINE_SIZE / 2}px solid transparent`};
    border-right: ${`${HIGHLIGHT_LINE_SIZE / 2}px solid transparent`};
    border-top: ${`${HIGHLIGHT_LINE_SIZE / 2}px solid white`};
    animation: arrow-pulse 1s infinite linear both;
  } */
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

  /* &:hover {
    opacity: 0.7;
  }

  &:active {
    opacity: 1;
  } */
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

const ButtonStyle = styled.img`
  -webkit-app-region: no-drag;
  -webkit-touch-callout: none;
  user-select: none;

  padding: 0;
  z-index: 2;
  position: absolute;
  cursor: pointer;
`
const svgThemedName = (theme, path) => {
  if (theme.type === 'dark') {
    return path.substring(0, path.lastIndexOf('.')) + '-dark' + path.substring(path.lastIndexOf('.'))
  }

  return path
}

const theme = {
  type: 'light'
}

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
      const Row = isLandingPadActive ? RowLandigPadStyle : RowStyle

      return (
        <div style={styles.root} {...otherProps}>
          {toggleChildrenVisibility && node.children && node.children.length > 0 && (
            <ButtonStyle
              draggable={false}
              src={svgThemedName(
                theme,
                node.expanded ? './assets/ui/expando_expanded.svg' : './assets/ui/expando_collapsed.svg'
              )}
              width={16}
              height={16}
              onClick={event => {
                event.preventDefault()
                event.stopPropagation()
                toggleChildrenVisibility({
                  node,
                  path,
                  treeIndex
                })
              }}
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
                    {icons && icons.length > 0 && (
                      <RowToolbarStyle>
                        {icons.map((icon, index) => (
                          <RowToolbarButtonStyle
                            key={index} // eslint-disable-line react/no-array-index-key
                          >
                            {icon}
                          </RowToolbarButtonStyle>
                        ))}
                      </RowToolbarStyle>
                    )}
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
