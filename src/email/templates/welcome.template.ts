export const welcomeTemplate = (nombre: string): string => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Bienvenido a NovaLibros</title>
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
                  <td align="right" style="color:#93c5fd; font-size:18px;">📚</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 32px 32px 16px 32px;">
              <div style="display:inline-block; background-color:#eff6ff; color:#1d4ed8; border-radius:999px; padding:4px 12px; font-size:11px; font-weight:700; letter-spacing:0.6px; text-transform:uppercase;">
                Bienvenida
              </div>
              <h1 style="margin:12px 0 12px 0; font-size:24px; line-height:1.3; color:#0f172a;">Bienvenido, ${nombre}</h1>
              <p style="margin:0 0 16px 0; font-size:15px; color:#475569; line-height:1.7;">
                Tu cuenta en <strong>NovaLibros</strong> fue creada con exito. Nos alegra tenerte en la comunidad de lectores.
              </p>
              <p style="margin:0 0 22px 0; font-size:15px; color:#475569; line-height:1.7;">
                Explora miles de titulos, guarda favoritos y gestiona tus compras desde un solo lugar.
              </p>

              <table cellpadding="0" cellspacing="0" style="margin: 0 0 24px 0;">
                <tr>
                  <td style="background-color:#2563eb; border-radius:10px;">
                    <a href="http://localhost:3000/login" style="display:inline-block; padding:14px 32px; font-size:15px; color:#ffffff; text-decoration:none; font-weight:600;">
                      Ir a NovaLibros
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 32px 24px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc; border:1px solid #e2e8f0; border-radius:12px;">
                <tr>
                  <td width="33%" align="center" style="padding:16px 8px;">
                    <div style="font-size:20px;">📖</div>
                    <div style="margin-top:6px; font-size:12px; color:#64748b;">Miles de titulos</div>
                  </td>
                  <td width="33%" align="center" style="padding:16px 8px;">
                    <div style="font-size:20px;">🛒</div>
                    <div style="margin-top:6px; font-size:12px; color:#64748b;">Compra facil</div>
                  </td>
                  <td width="33%" align="center" style="padding:16px 8px;">
                    <div style="font-size:20px;">⭐</div>
                    <div style="margin-top:6px; font-size:12px; color:#64748b;">Resenas y comunidad</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 32px;">
              <hr style="border:none; border-top:1px solid #e2e8f0; margin: 0;" />
            </td>
          </tr>

          <tr>
            <td style="padding: 20px 32px 28px 32px; text-align:center;">
              <p style="margin:0; font-size:12px; color:#94a3b8; line-height:1.6;">
                Recibiste este correo porque creaste una cuenta en NovaLibros. Si no fuiste tu, puedes ignorar este mensaje.
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
