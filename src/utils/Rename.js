/**
 * Renames file
 * @param {string} name of file
 * @returns {string} new name, where after name was puted timestamp
 */
const renameFile = (name) => {
    // eslint-disable-next-line
    const regexp = name.match(/\.\w+/)
    return regexp ? name.replace(regexp, Date.now() + regexp) : name
}

export default renameFile