import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Received help request:', message);

    const systemPrompt = `Você é um assistente virtual especializado da ADPM Casa de Zadoque, uma igreja em Montijo, Portugal. 

Informações sobre a aplicação:
- É uma aplicação web/móvel para membros da igreja
- Funcionalidades principais: horários, atividades, anúncios, comunidade, contacto, download da app
- Membros podem ver conteúdos e participar da comunidade
- Administradores podem gerir todos os conteúdos
- Sistema de autenticação com perfis de membro e admin
- Chat da comunidade onde membros podem partilhar posts, comentar e dar likes
- Upload de imagens e vídeos para administradores
- Notificações por email

Responda sempre em português de Portugal, seja prestativo e direto. Ajude com questões sobre:
- Como usar as funcionalidades da app
- Problemas técnicos básicos
- Navegação na aplicação
- Funcionalidades da comunidade
- Como contactar a igreja
- Informações sobre horários e atividades

Se não souber algo específico, seja honesto e sugira contactar diretamente a igreja.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI response generated successfully');

    return new Response(JSON.stringify({ 
      response: aiResponse,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-help-chat function:', error);
    return new Response(JSON.stringify({ 
      error: 'Desculpe, ocorreu um erro no chat de ajuda. Tente novamente.',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});