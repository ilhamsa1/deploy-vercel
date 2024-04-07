/**
 * +-----------------------------------------------------------------------------------------------------------------------------------------------------------------+
 * | Whoever comes across this file, please do not add more function here because this file is already too big for us to maintain,                                   |
 * | try to re-use existing functions.                                                                                                                               |
 * | If the function you're looking for does not exist, try consulting with design team first.                                                                       |
 * | If design has their own reasoning, only by then you may add new function to this file.                                                                          |
 * | And please add JSDoc with sufficient explanations such as short description and sample output                                                                   |
 * +-----------------------------------------------------------------------------------------------------------------------------------------------------------------+
 */
import dayjs, { Dayjs } from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import duration from 'dayjs/plugin/duration'
import isTomorrow from 'dayjs/plugin/isTomorrow'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(duration)
dayjs.extend(utc)
dayjs.extend(customParseFormat)
dayjs.extend(timezone)
dayjs.extend(relativeTime)
dayjs.extend(isTomorrow)

export type DateLikeInput = dayjs.ConfigTypeMap['default']

export const today = () => dayjs().toDate()

export const startOfDay = (time: DateLikeInput) => dayjs(time).startOf('day')
export const startOfYear = (time: DateLikeInput) => dayjs(time).startOf('year')
export const startOfMonth = (time: DateLikeInput) => dayjs(time).startOf('month')

export const endOfDay = (time: DateLikeInput) => dayjs(time).endOf('day')

export const createDateFromTextValue = (hour: number, minute = 0) => {
  return dayjs().set('hour', hour).set('minute', minute)
}

export const convertTorelativeTime = (date: DateLikeInput) => dayjs().from(date, true)

export const diffTime = (time: DateLikeInput): number => {
  const expiredTime = dayjs(time)
  return expiredTime.diff(today(), 'second')
}

export const getDiffDay = (startDate: Date, endDate: Date): number => {
  const startDateToDaysJs = dayjs(startDate)
  const endDateToDaysJs = dayjs(endDate)
  return endDateToDaysJs.diff(startDateToDaysJs, 'days')
}

export const getFormattedTime = (time: string) => {
  const hours = Number(time.slice(0, 2))
  const minute = time.slice(-2)

  const hour = hours % 12 || 12
  const hourAmPm = hours < 12 ? `AM` : `PM`
  return `${hour}:${minute} ${hourAmPm}`
}

export const getYearMonth = (date: DateLikeInput) => {
  const mDate = !date ? dayjs() : dayjs(date)
  return {
    year: mDate.year(),
    month: mDate.month() + 1, // because month start from 0
  }
}

export const dateOnlyFormat = (value: DateLikeInput = today()): string => {
  const date = dayjs(value)
  const year = date.year()
  const month = `0${date.month() + 1}`.slice(-2)
  const day = `0${date.date()}`.slice(-2)
  return `${year}-${month}-${day}`
}

export const formatDatePartWithoutYear = (date: DateLikeInput) => dayjs(date).format('DD MMMM')
export const formattedMessageDate = (date: DateLikeInput): string =>
  dayjs(date).format('on DD/MM/YYYY, [at] HH:mm')
export const formatTimeHour = (time: DateLikeInput = today()) => dayjs(time).format('HH:mm')
export const formatTimeWithDay = (time: DateLikeInput = today()) =>
  dayjs(time).format('HH:mm A (dddd)')
export const formatDateNameShortMonth = (time: DateLikeInput) => dayjs(time).format('DD MMM YYYY')
export const formatDate = (date: DateLikeInput = today()) => dayjs(date).format('DD/MM/YYYY')
export const formatDateNameWithTime = (time: DateLikeInput) =>
  dayjs(time).format('DD MMM YYYY, hh:mm A (dddd)')
export const formatDateWithTime = (time: DateLikeInput) =>
  dayjs(time).format('DD MMM YYYY, hh:mm A')
export const formatTime = (time: DateLikeInput) => dayjs(time).format('hh:mm A')
export const formatDateDefault = (date: DateLikeInput = today()) =>
  dayjs(date).format('YYYY-MM-DDT00:00:00Z')
export const formatDateAndMonthOnly = (time: DateLikeInput) => dayjs(time).format('DD/MM')
export const formatMonthOnly = (time: DateLikeInput) => dayjs(time).format('MMM')
export const formatYearOnly = (time: DateLikeInput) => dayjs(time).format('YYYY')
export const formatMonthAndYearOnly = (time: DateLikeInput) => dayjs(time).format('MMMM YYYY')

export const addDateByDay = (date: DateLikeInput = formatDateDefault(), count = 1) => {
  return dayjs(date).add(count, 'day')
}

export const subtractDateByDay = (date: DateLikeInput = formatDateDefault(), count = 1) => {
  return dayjs(date).subtract(count, 'd')
}

export const getDateList = (startDate: DateLikeInput = today(), length = 7) => {
  const dates = [] as Dayjs[]
  for (let i = 0; i < length; i++) {
    dates.push(dayjs(startDate).add(i, 'd').startOf('day'))
  }
  return dates
}

export const getMonthList = (startDate: DateLikeInput = today(), monthsCount: number) => {
  const months = [] as Dayjs[]
  for (let i = 0; i < monthsCount; i++) {
    months.push(dayjs(startDate).add(i, 'M').startOf('month'))
  }
  return months
}

export const durationDate = (time: number) => {
  return `${dayjs.duration(time, 'hours').asHours()} Hours`
}

export const addMinutes = (minutes: number) => {
  const currentDateTime = dayjs()
  const updatedDateTime = currentDateTime.add(minutes, 'm')

  return updatedDateTime.toDate()
}

export const addDays = (days: number, date?: DateLikeInput) => {
  const currentDateTime = dayjs(date)
  const updatedDateTime = currentDateTime.add(days, 'days')

  return updatedDateTime.toDate()
}

export const isOneDayDeliveryDate = (date: DateLikeInput) => {
  const currentDate = dayjs()
  const deliveryDate = dayjs(date)
  const oneDayBeforeDelivery = deliveryDate.subtract(1, 'day')
  const isOneDayBeforeDelivery = currentDate.isSame(oneDayBeforeDelivery, 'day')

  return isOneDayBeforeDelivery
}

export const isTodayBefore30DaysOfDate = (date: DateLikeInput) =>
  dayjs().isBefore(dayjs(date).add(30, 'day'))

export const isMoreThanDaysAhead = (date: DateLikeInput, days: number) =>
  dayjs().isAfter(addDays(days, date))

export const isAfterToday = (date: DateLikeInput) => dayjs().isAfter(dayjs(date))

export const dateToString = (date: DateLikeInput) => dayjs(date).toISOString()
export const stringToDate = (date: string) => dayjs(date).toDate()
