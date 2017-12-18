import * as React from 'react'
import {orderBy} from 'lodash'

export default class Table extends React.PureComponent {
  state = {
    desc: false,
    field: undefined
  }

  props: {
    sortBy: string,
    headers: Array<{key: string, name: string}>,
    data: Array<any>,
    renderItem(any): any
  }

  render() {
    const {headers, data, renderItem, sortBy} = this.props
    const {field = sortBy, desc} = this.state

    if (!data.length) {
      return <p>Nothing here!</p>
    }

    return (
      <table className="table table-striped table-hover">
        <thead>
          <tr>
          {headers.map(({key, name}) =>
            <th key={key}>
              <span
                style={{cursor: 'default'}}
                onClick={() => {
                  this.setState({field: key, desc: field === key ? !desc : desc });
                }}>
                {name}
                &nbsp;
                {field === key && <span>{desc ? '↓' : '↑'}</span>}
              </span>
            </th>
          )}
          </tr>
        </thead>
        <tbody>
          {orderBy(data, [field], [desc ? 'desc' : 'asc']).map(item => renderItem(item))}
        </tbody>
      </table>
    )
  }
}
