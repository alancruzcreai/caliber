# Conectar el WhatsApp + agente IA a Caliber (línea en vivo)

Objetivo: que **cada lead que llega por los anuncios** aparezca en Caliber **en tiempo real**, con la **respuesta ya redactada por la IA** (NEPQ + HSTP), y que Sebastian decida enviarla o editarla — para sentarse solo con leads calientes listos para cerrar a **$2,200 USD**.

Yo (Claude Code) ya construí TODO el código: el backend (`whatsapp-worker.js`) y la pantalla en Caliber (`inbox.html`). Faltan los pasos de cuenta/credenciales — esos los hace el cliente porque **no puedo crear cuentas ni manejar credenciales**.

---

## ⚠️ LO MÁS IMPORTANTE — léelo antes de empezar
Para que las conversaciones entren a Caliber en tiempo real y la IA pueda redactar respuestas, el número **debe estar en la WhatsApp Business *Cloud API* de Meta**. Y la regla de WhatsApp es absoluta:

> **Un número solo puede estar en la app de WhatsApp NORMAL *o* en la Cloud API — nunca en ambas.**

Consecuencia para **+52 811 577 2388**: al pasarlo a la Cloud API, **deja de funcionar en la app normal de WhatsApp en el teléfono**. A partir de ahí, **Sebastian atiende esos chats DESDE Caliber** (ahí ve todo y la IA le redacta). Es decir, **Caliber se vuelve su bandeja** para los leads de anuncios.

→ Si Sebastian usa ese número para WhatsApp personal, mejor usar un **número dedicado** solo para los anuncios (mismo proceso, número distinto). Confírmalo antes de migrar.

Buena noticia: como el lead **escribe primero** (clic en el anuncio), Sebastian/la IA pueden responder **libre y gratis dentro de la ventana de 24 h** de cada conversación (no se necesitan plantillas aprobadas para responder).

---

## Lo que necesito de su parte (en orden)

1. **Meta Business Manager** (el de Dragon Consultations). Tener el **Business ID**.
2. **App en Meta for Developers** → agregar el producto **WhatsApp**. (https://developers.facebook.com)
3. **Registrar el número** +52 811 577 2388 (o el dedicado) en la Cloud API:
   - Primero **borrarlo de la app de WhatsApp** (Ajustes → borrar cuenta de ese número), luego verificarlo por SMS/llamada en la plataforma.
   - Anotar el **`phone_number_id`** y el **WhatsApp Business Account ID**.
4. **Token permanente**: crear un **System User** en Business Manager con permisos `whatsapp_business_messaging` + `whatsapp_business_management` → generar token (no expira).
5. **App Secret** de la app de Meta (Configuración → Básica) — para verificar la firma del webhook.
6. **Cuenta Cloudflare** (gratis) para desplegar el Worker.
7. **API key de Anthropic** con créditos (la del agente) — ver sección de precios abajo.
8. Mauricio mantiene los **anuncios apuntando a ese número**.

---

## Despliegue (yo te guío; el cliente ejecuta)

### A. Worker en Cloudflare
1. Cloudflare → **Workers & Pages** → Create Worker → pega `whatsapp-worker.js` → Deploy.
2. **KV**: Storage & Databases → KV → crea un namespace `CALIBER_CONVOS`. En el Worker → Settings → Bindings → agrega **KV Namespace** con **Variable name `CONVOS`** → el namespace creado.
3. Worker → Settings → **Variables and Secrets** (Secret = oculto; Text = variable normal):
   - `WHATSAPP_TOKEN` (Secret) — el token permanente del System User
   - `WHATSAPP_PHONE_ID` (Text) — el `phone_number_id`
   - `WHATSAPP_VERIFY` (Secret) — una palabra que tú inventes (ej. `caliber-verify-9f2`)
   - `META_APP_SECRET` (Secret) — el App Secret de Meta
   - `ANTHROPIC_API_KEY` (Secret) — tu key de Anthropic
   - `READ_TOKEN` (Secret) — otra palabra que inventes (Caliber la usa para leer/enviar)
   - `MODE` (Text) — `assist` (recomendado; la IA redacta y Sebastian envía) o `auto`
   - `MODEL` (Text) — `claude-sonnet-4-6` (recomendado) o `claude-opus-4-8`
   - `CAMPAIGN_AD_IDS` (Text, opcional) — ids de anuncios de la campaña para filtrar
4. Deploy. Copia la **URL del Worker** (`https://...workers.dev`).

### B. Webhook en Meta
1. En la app de Meta → WhatsApp → Configuration → **Webhook**:
   - **Callback URL** = la URL del Worker
   - **Verify token** = el mismo `WHATSAPP_VERIFY`
   - Suscribir el campo **`messages`**.

### C. Conectar Caliber
Mándame la **URL del Worker** y el **`READ_TOKEN`** (no son la key secreta de Anthropic ni el token de WhatsApp — son seguros de compartir). Los pongo en `AGENT_WA_URL` / `AGENT_WA_KEY` y hago deploy. Listo: la bandeja se llena en vivo.

---

## Cómo se ve funcionando
- Un lead hace clic en el anuncio → escribe por WhatsApp → en **≤4 s** aparece en Caliber (Ad conversations).
- La IA ya dejó **redactada** la respuesta (NEPQ + HSTP). Sebastian: **Aprobar y enviar**, **editar**, o **Regenerar**.
- Marca 🔥 a los calientes → filtro "Hot only" para sentarse solo con esos.
- En modo `auto`, la IA responde sola y Sebastian solo entra a los calientes.

> Seguridad: la `READ_TOKEN` viaja en el navegador (es demo-grade). Para producción con muchos leads, se agrega login real. El token de WhatsApp y la key de Anthropic **nunca** salen del Worker.
