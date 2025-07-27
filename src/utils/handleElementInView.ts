export const handleElementInView = (e:React.MouseEvent<HTMLElement>, link:string): void => {
        e.preventDefault()
        const getElementInView = document.querySelector(link)
        if (getElementInView) {
            getElementInView.scrollIntoView({block: "center", behavior: "smooth"})
        }
    }