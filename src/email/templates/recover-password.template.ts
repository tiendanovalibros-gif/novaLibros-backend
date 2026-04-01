export const recoverPasswordTemplate = (
  nombre: string,
  resetLink: string,
): string => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Recuperar contraseña - NovaLibros</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f1eb; font-family: Georgia, 'Times New Roman', serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f1eb; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background-color:#1a1a2e; padding: 40px 48px; text-align:center;">
              <p style="margin:0; font-size:13px; color:#a89060; letter-spacing:3px; text-transform:uppercase; font-family: Arial, sans-serif;">Librería Digital</p>
              <h1 style="margin:8px 0 0 0; font-size:36px; color:#ffffff; letter-spacing:1px;">NovaLibros</h1>
              <p style="margin:6px 0 0 0; font-size:14px; color:#a89060;">🔐</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 48px 48px 32px 48px;">
              <h2 style="margin:0 0 16px 0; font-size:24px; color:#1a1a2e;">Hola, ${nombre}</h2>
              <p style="margin:0 0 20px 0; font-size:16px; color:#444; line-height:1.7;">
                Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>NovaLibros</strong>.
              </p>
              <p style="margin:0 0 32px 0; font-size:16px; color:#444; line-height:1.7;">
                Si fuiste tú quien solicitó el cambio, haz clic en el botón de abajo para crear una nueva contraseña:
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin: 0 0 32px 0;">
                <tr>
                  <td style="background-color:#a89060; border-radius:8px;">
                    <a href="${resetLink}"
                       style="display:inline-block; padding:16px 40px; font-size:16px; color:#ffffff; text-decoration:none; font-family: Arial, sans-serif; letter-spacing:0.5px; font-weight:bold;">
                      Restablecer contraseña
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Alternative link -->
              <p style="margin:0 0 24px 0; font-size:14px; color:#777; line-height:1.6; font-family: Arial, sans-serif;">
                Si el botón no funciona, copia y pega este enlace en tu navegador:
              </p>
              <p style="margin:0 0 32px 0; font-size:13px; color:#0066cc; word-break:break-all; font-family: 'Courier New', monospace; background-color:#f5f5f5; padding:12px; border-radius:6px; border:1px solid #e0e0e0;">
                ${resetLink}
              </p>

              <!-- Important Info -->
              <div style="background-color:#fff8e1; border-left:4px solid #ffc107; padding:16px 20px; margin: 0 0 24px 0; border-radius:4px;">
                <p style="margin:0 0 8px 0; font-size:14px; color:#856404; font-weight:bold; font-family: Arial, sans-serif;">
                  ⚠️ Información importante
                </p>
                <p style="margin:0; font-size:13px; color:#856404; line-height:1.6; font-family: Arial, sans-serif;">
                  Este enlace expirará en <strong>15 minutos</strong> por razones de seguridad.
                </p>
              </div>

              <!-- Security Warning -->
              <div style="background-color:#f8f9fa; border-radius:6px; padding:16px 20px;">
                <p style="margin:0 0 12px 0; font-size:14px; color:#495057; font-family: Arial, sans-serif;">
                  <strong>🛡️ Seguridad de tu cuenta</strong>
                </p>
                <p style="margin:0; font-size:13px; color:#6c757d; line-height:1.6; font-family: Arial, sans-serif;">
                  Si <strong>no solicitaste</strong> este cambio de contraseña, ignora este correo y tu contraseña permanecerá sin cambios.
                  Te recomendamos cambiar tu contraseña si crees que alguien más tiene acceso a tu cuenta.
                </p>
              </div>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 48px;">
              <hr style="border:none; border-top:1px solid #e8e0d0; margin: 0;" />
            </td>
          </tr>

          <!-- Help Section -->
          <tr>
            <td style="padding: 32px 48px 40px 48px; text-align:center;">
              <p style="margin:0 0 12px 0; font-size:14px; color:#777; font-family: Arial, sans-serif;">
                ¿Necesitas ayuda?
              </p>
              <p style="margin:0; font-size:13px; color:#777; line-height:1.6; font-family: Arial, sans-serif;">
                Contáctanos en
                <a href="mailto:soporte@novalibros.com" style="color:#a89060; text-decoration:none;">soporte@novalibros.com</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f9f6f0; padding: 24px 48px; text-align:center; border-top:1px solid #e8e0d0;">
              <p style="margin:0 0 8px 0; font-size:12px; color:#aaa; font-family:Arial,sans-serif; line-height:1.6;">
                Este es un correo automático de NovaLibros.<br/>
                Por favor, no respondas a este mensaje.
              </p>
              <p style="margin:0; font-size:11px; color:#ccc; font-family:Arial,sans-serif;">
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
