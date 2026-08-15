import Stripe from "stripe"

export const getStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY!)

export const getSubscriptionPrice = async (subscriptionId: string) => {
    const stripe = getStripe()
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, { expand: ["items.data.price"] })

    const amount = subscription.items.data.reduce((sum, item) => sum + (item.price.unit_amount ?? 0) * (item.quantity ?? 1), 0)
    const interval = subscription.items.data[0]?.price.recurring?.interval ?? "month"
    const currency = subscription.items.data[0]?.price.currency ?? "usd"

    return { amount: amount / 100, interval, currency }
}
