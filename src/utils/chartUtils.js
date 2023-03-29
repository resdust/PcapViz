function convertDatetoTimestamp(date) {
  return new Date(date).getTime()
}

function selectChartRange(myChart, startDate, duration, originStartDate, originEndDate) {
  console.log('selectRangeEvent', 'from', startDate, 'lasting', duration)

  const originDuration = convertDatetoTimestamp(originEndDate) - convertDatetoTimestamp(originStartDate)
  const startOffset = convertDatetoTimestamp(startDate) - convertDatetoTimestamp(originStartDate)
  const endOffset = startOffset + duration * 24 * 60 * 60 * 1000
  const start = startOffset / originDuration * 100
  const end = endOffset / originDuration * 100

  myChart.dispatchAction({
    type: 'dataZoom',
    start: start,
    end: end
  })
}

export { selectChartRange}