export const resetPasswordTemplate = (
  nombre: string,
  resetLink: string,
): string => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Restablecer contrasena - NovaLibros</title>
</head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family: 'DM Sans', 'Manrope', 'Avenir Next', sans-serif; color:#0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc; padding: 32px 12px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:600px; background-color:#ffffff; border-radius:16px; overflow:hidden; border:1px solid #e2e8f0; box-shadow: 0 16px 40px rgba(15,23,42,0.08);">
          <tr>
            <td style="background-color:#0f172a; padding: 24px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="left">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background-color:#2563eb; border-radius:12px; width:40px; height:40px; text-align:center;">
                          <span style="display:inline-block; font-size:20px; color:#ffffff; font-weight:700; line-height:40px;">N</span>
                        </td>
                        <td style="padding-left:12px;">
                          <div style="font-size:18px; font-weight:700; color:#ffffff; letter-spacing:-0.3px;">NovaLibros</div>
                          <div style="font-size:11px; color:#94a3b8; letter-spacing:2px; text-transform:uppercase;">Tu libreria en linea</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" style="color:#93c5fd; font-size:18px;">🔐</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 32px 32px 24px 32px;">
              <div style="display:inline-block; background-color:#eff6ff; color:#1d4ed8; border-radius:999px; padding:4px 12px; font-size:11px; font-weight:700; letter-spacing:0.6px; text-transform:uppercase;">
                Recuperacion
              </div>
              <h1 style="margin:12px 0 12px 0; font-size:24px; line-height:1.3; color:#0f172a;">Restablece tu contrasena</h1>
              <p style="margin:0 0 18px 0; font-size:15px; color:#475569; line-height:1.7;">
                Hola, <strong style="color:#0f172a;">${nombre}</strong>. Recibimos una solicitud para restablecer la contrasena de tu cuenta en <strong>NovaLibros</strong>.
              </p>
              <p style="margin:0 0 24px 0; font-size:15px; color:#475569; line-height:1.7;">
                Si fuiste tu quien solicito el cambio, usa el boton para crear una nueva contrasena.
              </p>

              <table cellpadding="0" cellspacing="0" style="margin: 0 0 24px 0;">
                <tr>
                  <td style="background-color:#2563eb; border-radius:10px;">
                    <a href="${resetLink}" style="display:inline-block; padding:14px 32px; font-size:15px; color:#ffffff; text-decoration:none; font-weight:600;">
                      Restablecer contrasena
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 12px 0; font-size:13px; color:#64748b; line-height:1.6;">
                Si el boton no funciona, copia y pega este enlace en tu navegador:
              </p>
              <p style="margin:0 0 24px 0; font-size:12px; color:#1d4ed8; word-break:break-all; font-family: 'Courier New', monospace; background-color:#f1f5f9; padding:12px; border-radius:10px; border:1px solid #e2e8f0;">
                ${resetLink}
              </p>

              <div style="background-color:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:14px 16px; margin: 0 0 16px 0;">
                <p style="margin:0 0 8px 0; font-size:13px; color:#0f172a; font-weight:700;">Tiempo limitado</p>
                <p style="margin:0; font-size:13px; color:#475569; line-height:1.6;">
                  Este enlace expira en <strong>15 minutos</strong> por seguridad.
                </p>
              </div>

              <div style="background-color:#fefce8; border:1px solid #fde68a; border-radius:12px; padding:14px 16px;">
                <p style="margin:0 0 8px 0; font-size:13px; color:#92400e; font-weight:700;">Seguridad de tu cuenta</p>
                <p style="margin:0; font-size:13px; color:#92400e; line-height:1.6;">
                  Si no solicitaste este cambio, ignora este correo. Te recomendamos actualizar tu contrasena si crees que alguien mas tiene acceso a tu cuenta.
                </p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 32px;">
              <hr style="border:none; border-top:1px solid #e2e8f0; margin: 0;" />
            </td>
          </tr>

          <tr>
            <td style="padding: 24px 32px 28px 32px; text-align:center;">
              <p style="margin:0 0 8px 0; font-size:13px; color:#64748b;">Necesitas ayuda?</p>
              <p style="margin:0; font-size:13px; color:#64748b; line-height:1.6;">
                Contactanos en
                <a href="mailto:soporte@novalibros.com" style="color:#2563eb; text-decoration:none;">soporte@novalibros.com</a>
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color:#f8fafc; padding: 18px 32px; text-align:center; border-top:1px solid #e2e8f0;">
              <p style="margin:0 0 6px 0; font-size:11px; color:#94a3b8; line-height:1.6;">
                Este es un correo automatico de NovaLibros. Por favor, no respondas a este mensaje.
              </p>
              <p style="margin:0; font-size:11px; color:#cbd5e1;">
                © ${new Date().getFullYear()} NovaLibros. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
