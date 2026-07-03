# Conectar el WhatsApp + agente IA a Caliber (línea en vivo)

Objetivo: que **cada lead que llega por los anuncios actuales** aparezca en Caliber **en tiempo real**, con la **respuesta ya redactada por la IA** (usando el PDF de ventas + todo el programa HSTP), y que Sebastian decida enviarla, editarla o descartarla — para sentarse solo con leads calientes listos para cerrar a **$2,200 USD**.

Número destino de los leads: **+1 (346) 247-4443**. Todo se trabaja **desde Caliber** — no se necesita ninguna app de WhatsApp en ningún teléfono para esta línea.

Ya construí todo el código, incluyendo una **página de un solo clic** (`connect-whatsapp.html`) para que Sebastian conecte el número sin copiar ningún token a mano. Lo que queda son unos pasos de panel de Meta que solo yo (Alan, dueño de la app "caliber sebastian") puedo hacer, y un clic que solo Sebastian puede dar (con su propia cuenta de Facebook).

Todo lo de abajo está verificado contra la documentación oficial de Meta y de Anthropic (jun-2026) — nada inventado.

---

## Preguntas ya resueltas

**¿El número necesita ser WhatsApp Business primero?** No. Un número que nunca ha estado en WhatsApp se registra directo en la API — de hecho es más simple que uno con historial. Único requisito real: **debe poder recibir un SMS o llamada de voz** (así lo verifica Meta). Ya confirmado con el cliente ✅.

**¿Necesito ser administrador del Business Manager del cliente?** No. El flujo de Meta (**Embedded Signup**) está diseñado exactamente para esto: Sebastian inicia sesión con SU propia cuenta de Facebook y ahí mismo le da acceso a mi app — nunca necesito ser admin de su cuenta.

**¿Se necesita aprobación de Meta (App Review)?** No, para usar la API con el propio negocio del cliente. Pero hay un detalle real que si no se atiende, bloquea a Sebastian al querer conectar: **si mi app sigue en "modo desarrollo" en el panel de Meta, solo las personas con rol de admin/developer/tester EN MI app pueden completar el Embedded Signup — Sebastian no tiene ese rol.** Dos formas de resolverlo (elige una):
- **(A) Recomendado** — Pasar la app "caliber sebastian" a **modo Live** en el panel de Meta (Configuración básica: agregar URL de política de privacidad, ícono, categoría → luego el switch App Mode → Live). Los permisos de WhatsApp obtienen acceso estándar sin revisión de Meta, así que cualquier persona externa (Sebastian) puede completar el flujo.
- **(B) Más rápido si (A) tiene fricción** — Agregar a Sebastian como **Tester** de tu app (Panel de Meta → Roles de la app → Agregar personas → Tester, con su cuenta de Facebook). Desbloquea el flujo de inmediato, aunque no es lo ideal para producción a largo plazo.

**Límite de mensajes:** una cuenta nueva/sin verificar empieza en **250 destinatarios únicos cada 24 h**. Sube automáticamente con Verificación de Negocio de Meta o buena calidad sostenida. No es un problema al volumen actual — avisar si crece.

---

## Lo que hago yo (Alan) — una sola vez, en el panel de Meta

1. En la app **"caliber sebastian"** (App ID `2126295867938046`) → **Facebook Login for Business** → **Configurations** → **Create Configuration**:
   - Nombre: algo como "Caliber WhatsApp".
   - Login variation: **WhatsApp Embedded Signup**.
   - Permisos a habilitar: **`whatsapp_business_management`** y **`whatsapp_business_messaging`** (ambos).
   - Guardar → copiar el **Configuration ID** (`config_id`).
2. Resolver el bloqueo de modo desarrollo — opción (A) o (B) de arriba.
3. Configurar el **webhook a nivel app**: WhatsApp → Configuration → Webhook:
   - Callback URL = la URL del Worker (una vez desplegado, paso siguiente).
   - Verify token = el mismo valor que pondré en `WHATSAPP_VERIFY`.
   - Suscribir el campo **`messages`**.
4. Pegar el `config_id` en `connect-whatsapp.html` (ya tiene el lugar marcado) y la URL del Worker en `assets/agent-brain.js` (`AGENT_WA_URL`) → deploy.

## Lo que hace Sebastian — un clic

Le mando el enlace a **`connect-whatsapp.html`**. Ahí:
1. Pulsa **"Conectar WhatsApp con Facebook"**.
2. Inicia sesión con su propia cuenta de Facebook (dentro de la ventana de Meta).
3. Elige o crea el **Business Portfolio** de Dragon Consultations y la cuenta de WhatsApp Business (WABA).
4. Ingresa el número **+1 (346) 247-4443** y el código que reciba por SMS o llamada.
5. En la pantalla final, confirma dar acceso a mi app.

En cuanto termina, la página misma le confirma "✓ Listo — tu WhatsApp ya está conectado a Caliber" — el backend hace automáticamente el resto (registrar el número, activar el webhook). **Sebastian no copia ni pega ningún token.**

---

## Despliegue del backend (lo hago yo en Cloudflare)

1. Cloudflare → **Workers & Pages** → Create Worker → pegar `whatsapp-worker.js` → Deploy.
2. **KV**: Storage & Databases → KV → crear namespace `CALIBER_CONVOS`. Worker → Settings → Bindings → **KV Namespace**, variable `CONVOS` → el namespace creado.
3. Worker → Settings → **Variables and Secrets**:
   - `META_APP_SECRET` (Secret) — App Secret de "caliber sebastian"
   - `WHATSAPP_VERIFY` (Secret) — palabra que yo invente (ej. `caliber-verify-9f2`)
   - `WHATSAPP_PIN` (Secret) — un PIN de 6 dígitos que yo invente, para el 2-step verification del número
   - `ANTHROPIC_API_KEY` (Secret) — la key de Anthropic del cliente (ver precios abajo)
   - `READ_TOKEN` (Secret) — palabra que yo invente (Caliber la usa para leer/enviar)
   - `MODE` (Text) — `assist` (recomendado) o `auto`
   - `MODEL` (Text) — `claude-sonnet-5` (recomendado)
   - `MODEL_FALLBACK` (Text) — `claude-haiku-4-5` (ya es el valor por defecto en el código)
   - `CAMPAIGN_AD_IDS` (Text, opcional) — ids de anuncios para filtrar
4. Deploy → copiar la URL del Worker → ponerla en `assets/agent-brain.js` (`AGENT_WA_URL`) y en `connect-whatsapp.html` (se toma automáticamente de ahí) → deploy de Caliber.

*(`WHATSAPP_TOKEN` / `WHATSAPP_PHONE_ID` ya NO se configuran a mano — los llena solo el flujo de un clic. Quedan solo como respaldo manual opcional.)*

---

## Precios de la IA — verificado, sin inventar nada

**No existe una versión gratuita permanente de la API de Claude.** La suscripción a Claude.ai (el chat) **no incluye** acceso a la API — son cuentas y facturas separadas, confirmado en la documentación oficial de Anthropic. Nuevas cuentas reciben "una pequeña cantidad de créditos gratis para probar" (sin monto público), pero después el uso se cobra.

**La buena noticia: al volumen actual, el costo real es mínimo.**

| Modelo | Precio (entrada / salida por 1M tokens) | Uso |
|---|---|---|
| **Sonnet 5** ⭐ | $2 / $10 (precio de lanzamiento hasta 31-ago-2026; luego $3/$15) | El que uso por defecto — mejor balance calidad/precio |
| Haiku 4.5 | $1 / $5 | Respaldo automático si el modelo principal falla (ya en el código) |
| Opus 4.8 | $5 / $25 | Opcional, para el máximo poder de cierre en leads calientes |

Con el **cache de prompt** ya activo, cada turno cuesta ~10% de lo normal. Una conversación completa sale en **centavos de dólar** — frente a un cierre de $2,200, es irrelevante.

**Para que nunca se quede sin saldo a media conversación:**
1. **Auto-recarga de Anthropic** (Console → Billing → Auto-reload): define *"cuando el saldo baje de $X, recarga $Y"*. Recomendado: recargar $10 cuando baje de $5.
2. **Respaldo automático en el código**: si el modelo principal falla, el Worker reintenta con Haiku 4.5 antes de rendirse.

---

## Cómo se ve funcionando
- Un lead hace clic en el anuncio → escribe por WhatsApp al +1 346 247 4443 → en **≤4 s** aparece en Caliber (Ad conversations).
- La IA ya dejó **redactada** la respuesta (NEPQ + todo el conocimiento del HSTP). Sebastian: **Aprobar y enviar**, **editar**, o **Regenerar** — todo desde Caliber.
- Marca 🔥 a los calientes → filtro "Hot only" para sentarse solo con esos.
- En modo `auto`, la IA responde sola y Sebastian solo entra a los que ya están calientes.

> Seguridad: la `READ_TOKEN` viaja en el navegador (nivel demo — suficiente para este volumen). El token de WhatsApp (obtenido automáticamente) y la key de Anthropic **nunca** salen del Worker — Caliber nunca los ve directamente.
