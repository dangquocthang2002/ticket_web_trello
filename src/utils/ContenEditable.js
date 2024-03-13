//onKeyDown
export const saveContentAfterEnter = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault()
        e.target.blur()
    }
}

