import dayjs from 'dayjs'
import 'dayjs/locale/id'

dayjs.locale('id')

export const formatDayDate = (date) => {
  return dayjs(date).format('dddd, DD MMMM YYYY')
}

export const formatDate = (date) => {
  return dayjs(date).format('DD MMMM YYYY')
}

export const formatDateTime = (date) => {
  return dayjs(date).format('DD MMMM YYYY HH:mm')
}
