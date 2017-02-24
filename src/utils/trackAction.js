// @flow
import GA from 'react-ga'

export default (action: string, value?: string | number) => {
  GA.event({
    category: 'Redux Action',
    action,
    label: value && isNaN(value) ? '' + value : undefined,
    value: !isNaN(value) ? value : undefined
  })
}
