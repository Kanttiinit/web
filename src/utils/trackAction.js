import GA from 'react-ga'

export default (action, value) => {
  GA.event({
    category: 'Redux Action',
    action,
    label: isNaN(value) ? '' + value : undefined,
    value: !isNaN(value) ? value : undefined
  })
}
