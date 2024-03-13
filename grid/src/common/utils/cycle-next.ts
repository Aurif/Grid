export default function cycleNext<T>(valueList: T[], currentValue: T) {
  const index = valueList.indexOf(currentValue)
  if (index == -1) throw Error('Current value is not present in the list of possible values')
  return valueList[(index + 1) % valueList.length]
}
