import { query as q } from "faunadb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { fauna } from "../../../services/fauna";
import { stripe } from "../../../services/stripe";

type FaunaUser = {
  ref: {
    id: string;
  },
  data: {
    email: string;
    stripe_customer_id?: string;
  }
}

const subscribe = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method not allowed');
  }

  const {user} = await getSession({ req });

  const faunaUser = await fauna.query<FaunaUser>(
    q.Get(
      q.Match(
        q.Index('user_by_email'),
        q.Casefold(user.email),
      )
    )
  )

  let customerId = faunaUser.data.stripe_customer_id;

  if (!customerId) {
    const stripeCustomer = await stripe.customers.create({
      email: user.email,
    });
    customerId = stripeCustomer.id;
  }

  await fauna.query(
    q.Update(
      q.Ref(q.Collection('users'), faunaUser.ref.id),
      { data: { stripe_customer_id: customerId } }
    )
  )

  const stripeCheckoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    billing_address_collection: 'required',
    line_items: [{
      price: 'price_1Jv80CKNEgMV6uf1gL4753zo', quantity: 1
    }],
    mode: 'subscription',
    allow_promotion_codes: true,
    cancel_url: process.env.STRIPE_CANCEL_URL,
    success_url: process.env.STRIPE_SUCCESS_URL,
    customer: customerId,
  });

  return res.status(200).json({ sessionId: stripeCheckoutSession.id })
}

export default subscribe;