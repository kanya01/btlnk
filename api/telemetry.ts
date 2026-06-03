import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    // Basic payload validation to prevent bot spam
    const { span, deliveryMode, speed, easyMode, avgReactionTime, avgHesitation, score } = data;

    if (
      typeof span !== 'number' || span < 0 || span > 20 ||
      typeof speed !== 'number' || speed < 0 || speed > 3.0
    ) {
      console.error("Payload validation failed", { span, typeofSpan: typeof span, speed, typeofSpeed: typeof speed });
      return res.status(400).json({ error: 'Invalid payload' });
    }

    // Return early if not configured, rather than crashing
    if (!supabaseUrl || !supabaseKey) {
      console.warn("Telemetry endpoint called but Supabase credentials are not configured.");
      return res.status(200).json({ success: false, reason: "unconfigured" });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase
      .from('global_runs')
      .insert([
        {
          span,
          delivery_mode: deliveryMode,
          speed,
          easy_mode: easyMode,
          reaction_time: avgReactionTime || null,
          hesitation: avgHesitation || null,
          score: score || null
        }
      ]);

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error processing telemetry request:', error.message || error);
    return res.status(400).json({ error: 'Bad Request', details: error.message || String(error) });
  }
}
