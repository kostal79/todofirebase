/**
 * Make string from date object
 * @param {date} date - Date object
 * @returns {string} format YYYY-[M]M-[D]D
 */
function DateForm(date) {
    let month = date.getMonth() + 1;
    month = String(month.length) < 2 ? '0' + String(month) : String(month);
    let day = String(date.getDate()).length < 2 ? '0' + String(date.getDate()) : String(date.getDate());
    try {
        return `${date.getFullYear()}-${month}-${day}`
    } catch(err) {
        console.log('Incorrenct form of date')
    }
}

export default DateForm
