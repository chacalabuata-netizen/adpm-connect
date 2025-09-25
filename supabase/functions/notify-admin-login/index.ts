import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Removed Resend dependency - function can be updated to use email service when needed

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

    // Log admin login (email notification can be added later if needed)
    console.log('Admin login:', {
      admin: `${adminName} (${adminEmail})`,
      time: new Date(loginTime).toLocaleString('pt-BR'),
      userAgent
    });

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Admin login logged successfully"
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