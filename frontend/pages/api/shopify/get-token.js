import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const { shop } = req.query;
  if (!shop) return res.status(400).json({ error: 'Missing shop' });

  const { data, error } = await supabase
    .from('shop_tokens')
    .select('access_token')
    .eq('shop', shop)
    .single();

  if (error || !data) return res.status(404).json({ error: 'Token not found' });

  res.status(200).json({ access_token: data.access_token });
}