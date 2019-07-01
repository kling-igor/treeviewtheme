import React, { PureComponent } from 'react'
import 'react-sortable-tree/style.css'
import SortableTree from 'react-sortable-tree'

import { GlobalStyle } from './style'
import FileExplorerTheme from './filetheme'

export default class App extends PureComponent {
  state = {
    treeData: [
      {
        title: 'chicken',
        isDirectory: true,
        expanded: false,
        children: [{ title: 'egg' }, { title: 'egg' }, { title: 'egg' }]
      }
      // { title: '.gitignore' },
      // { title: 'package.json' },
      // {
      //   title: 'src',
      //   isDirectory: true,
      //   expanded: true,
      //   children: [
      //     { title: 'styles.css' },
      //     { title: 'index.js' },
      //     { title: 'reducers.js' },
      //     { title: 'actions.js' },
      //     { title: 'utils.js' }
      //   ]
      // },
      // {
      //   title: 'tmp',
      //   isDirectory: true,
      //   children: [{ title: '12214124-log' }, { title: 'drag-disabled-file', dragDisabled: true }]
      // },
      // {
      //   title: 'build',
      //   isDirectory: true,
      //   children: [{ title: 'react-sortable-tree.js' }]
      // },
      // {
      //   title: 'public',
      //   isDirectory: true
      // },
      // {
      //   title: 'node_modules',
      //   isDirectory: true
      // }
    ]
  }

  render() {
    return (
      <>
        <GlobalStyle />
        <div style={{ height: 900 }}>
          <SortableTree
            scaffoldBlockPxWidth={16}
            theme={FileExplorerTheme}
            treeData={this.state.treeData}
            onChange={treeData => this.setState({ treeData })}
            canDrag={({ node }) => !node.dragDisabled}
            canDrop={({ nextParent }) => !nextParent || nextParent.isDirectory}
          />
        </div>
      </>
    )
  }
}
