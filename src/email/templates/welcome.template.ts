export const welcomeTemplate = (nombre: string): string => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Bienvenido a NovaLibros</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f1eb; font-family: Georgia, 'Times New Roman', serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f1eb; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
          <tr>
            <td style="background-color:#1a1a2e; padding: 40px 48px; text-align:center;">
              <p style="margin:0; font-size:13px; color:#a89060; letter-spacing:3px; text-transform:uppercase; font-family: Arial, sans-serif;">Librería Digital</p>
              <h1 style="margin:8px 0 0 0; font-size:36px; color:#ffffff; letter-spacing:1px;">NovaLibros</h1>
              <p style="margin:6px 0 0 0; font-size:14px; color:#a89060;">📚</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 48px 48px 32px 48px;">
              <h2 style="margin:0 0 16px 0; font-size:24px; color:#1a1a2e;">¡Bienvenido, ${nombre}!</h2>
              <p style="margin:0 0 20px 0; font-size:16px; color:#444; line-height:1.7;">
                Tu cuenta en <strong>NovaLibros</strong> ha sido creada exitosamente.
                Nos alegra tenerte como parte de nuestra comunidad de lectores.
              </p>
              <p style="margin:0 0 32px 0; font-size:16px; color:#444; line-height:1.7;">
                Explora miles de títulos, guarda tus favoritos, realiza pedidos y mucho más.
              </p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#a89060; border-radius:8px;">
                    <a href="http://localhost:3000/login"
                       style="display:inline-block; padding:14px 32px; font-size:15px; color:#ffffff; text-decoration:none; font-family: Arial, sans-serif; font-weight:bold;">
                      Ir a NovaLibros →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 48px 40px 48px;">
              <hr style="border:none; border-top:1px solid #e8e0d0; margin: 0 0 32px 0;" />
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="33%" style="text-align:center; padding: 0 8px;">
                    <p style="font-size:24px; margin:0 0 8px 0;">📖</p>
                    <p style="margin:0; font-size:13px; color:#777; font-family:Arial,sans-serif;">Miles de<br/>títulos</p>
                  </td>
                  <td width="33%" style="text-align:center; padding: 0 8px;">
                    <p style="font-size:24px; margin:0 0 8px 0;">🛒</p>
                    <p style="margin:0; font-size:13px; color:#777; font-family:Arial,sans-serif;">Compra<br/>fácil</p>
                  </td>
                  <td width="33%" style="text-align:center; padding: 0 8px;">
                    <p style="font-size:24px; margin:0 0 8px 0;">⭐</p>
                    <p style="margin:0; font-size:13px; color:#777; font-family:Arial,sans-serif;">Reseñas y<br/>comunidad</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f9f6f0; padding: 24px 48px; text-align:center; border-top:1px solid #e8e0d0;">
              <p style="margin:0; font-size:12px; color:#aaa; font-family:Arial,sans-serif; line-height:1.6;">
                Recibiste este correo porque creaste una cuenta en NovaLibros.<br/>
                Si no fuiste tú, puedes ignorar este mensaje.
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
