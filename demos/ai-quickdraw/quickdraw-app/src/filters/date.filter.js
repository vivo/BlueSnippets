import { format as formatDate } from 'date-fns'

/**
 * @param {String|Number|Date} value The date to format.
 * @param {String} formatToken The token for date-fns format function.
 * @returns {String} The formatted date string.
 */
export default function (value, formatToken = 'yyyy-MM-dd HH:mm:ss') {
  if (!value) return ''
  try {
    return formatDate(new Date(value), formatToken)
  } catch (error) {
    console.error('Error formatting date:', value, error)
    return String(value) // Fallback to string representation
  }
}
