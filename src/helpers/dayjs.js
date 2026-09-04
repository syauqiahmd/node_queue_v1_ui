import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/id'

dayjs.extend(utc)
dayjs.locale('id')

export const formatDayDate = (date) => {
  return dayjs.utc(date).format('dddd, DD MMMM YYYY')
}

export const formatDate = (date) => {
  return dayjs.utc(date).format('DD MMMM YYYY')
}

export const formatDateTime = (date) => {
  return dayjs.utc(date).format('DD MMMM YYYY HH:mm')
}
