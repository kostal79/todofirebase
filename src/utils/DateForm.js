function DateForm(date) {
    try {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    } catch(err) {
        console.log('Incorrenct form of date')
    }
}

export default DateForm