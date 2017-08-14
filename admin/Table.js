import React from 'react'
import orderBy from 'lodash/orderBy'

export default class Table extends React.PureComponent {
  state = {
    desc: false,
    field: undefined
  }

  render() {
    const {headers, data, renderItem, sortBy} = this.props
    const {field = sortBy, desc} = this.state

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
