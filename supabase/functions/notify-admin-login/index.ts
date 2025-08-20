import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

interface AdminLoginNotification {
  adminEmail: string;
  adminName: string;
  loginTime: string;
  userAgent?: string;
  ipAddress?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { adminEmail, adminName, loginTime, userAgent, ipAddress }: AdminLoginNotification = await req.json();

    console.log(`Admin login detected: ${adminEmail} at ${loginTime}`);

    const emailResponse = await resend.emails.send({
      from: "ADPM Admin <noreply@adpm.com>",
      to: ["mmariopack@gmail.com"],
      subject: "🔐 Acesso Admin Detectado - ADPM Casa de Zadoque",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1f2937; margin: 0; font-size: 24px;">🔐 Acesso Admin Detectado</h1>
              <p style="color: #6b7280; margin: 10px 0 0 0;">ADPM Casa de Zadoque - Sistema de Gestão</p>
            </div>
            
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin-bottom: 20px; border-radius: 4px;">
              <h3 style="color: #92400e; margin: 0 0 8px 0; font-size: 16px;">⚠️ Alerta de Segurança</h3>
              <p style="color: #92400e; margin: 0; font-size: 14px;">Um administrador fez login na plataforma ADPM.</p>
            </div>

            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
              <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 16px;">Detalhes do Acesso:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 500; width: 120px;">👤 Admin:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${adminName} (${adminEmail})</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">🕒 Horário:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${new Date(loginTime).toLocaleString('pt-PT')}</td>
                </tr>
                ${userAgent ? `
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">🌐 Navegador:</td>
                  <td style="padding: 8px 0; color: #1f2937; font-size: 12px;">${userAgent}</td>
                </tr>
                ` : ''}
                ${ipAddress ? `
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">📍 IP:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${ipAddress}</td>
                </tr>
                ` : ''}
              </table>
            </div>

            <div style="background-color: #dbeafe; border: 1px solid #93c5fd; padding: 16px; border-radius: 6px; margin-bottom: 20px;">
              <h3 style="color: #1e40af; margin: 0 0 8px 0; font-size: 14px;">📋 Ações Recomendadas:</h3>
              <ul style="color: #1e40af; margin: 0; padding-left: 20px; font-size: 14px;">
                <li>Verificar se o acesso foi autorizado</li>
                <li>Monitorizar atividades do sistema</li>
                <li>Revogar acesso se suspeito</li>
              </ul>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                ADPM Casa de Zadoque - Montijo<br>
                Sistema automatizado de monitorização
              </p>
            </div>
          </div>
        </div>
      `,
    });

    console.log("Admin notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Admin notification sent successfully",
      emailId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in notify-admin-login function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);