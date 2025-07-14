export const fromattedCurrancy = (amount:number) => {
    return new Intl.NumberFormat("sv-SE", {
        style: "currency",
        currency: "SEK",
        minimumFractionDigits: 0
    }).format(amount)
}