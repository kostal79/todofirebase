/**
 * Make string from date object
 * @param {date} date - Date object
 * @returns {string} format YYYY-[M]M-[D]D
 */
function DateForm(date) {
    try {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    } catch(err) {
        console.log('Incorrenct form of date')
    }
}

export default DateForm