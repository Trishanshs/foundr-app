import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const { code, shop } = req.query;
  if (!shop || !code) return res.status(400).send('Missing parameters');

  try {
    const tokenRes = await axios.post(`https://${shop}/admin/oauth/access_token`, {
      client_id: process.env.SHOPIFY_API_KEY,
      client_secret: process.env.SHOPIFY_API_SECRET,
      code,
    });

    const { access_token } = tokenRes.data;
    await supabase.from('shop_tokens').upsert({ shop, access_token }, { onConflict: 'shop' });

    res.status(200).send('✅ App installed. You may close this tab.');
  } catch (error) {
    console.error('OAuth error:', error);
    res.status(500).send('OAuth failed');
  }
}