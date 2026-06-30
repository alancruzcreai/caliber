# Conectar el WhatsApp + agente IA a Caliber (línea en vivo)

Objetivo: que **cada lead que llega por los anuncios** aparezca en Caliber **en tiempo real**, con la **respuesta ya redactada por la IA** (NEPQ + HSTP), y que Sebastian decida enviarla o editarla — para sentarse solo con leads calientes listos para cerrar a **$2,200 USD**.

Yo (Claude Code) ya construí TODO el código: el backend (`whatsapp-worker.js`) y la pantalla en Caliber (`inbox.html`). Faltan los pasos de cuenta/credenciales — esos los hace el cliente porque **no puedo crear cuentas ni manejar credenciales**.

---

## ✅ El enfoque: COEXISTENCIA (Sebastian conserva su WhatsApp)
WhatsApp **Coexistence** (oficial de Meta, disponible desde may-2025, México incluido) permite que el **mismo número** esté **a la vez** en la app **WhatsApp Business** del iPhone de Sebastian **y** conectado a la Cloud API que alimenta Caliber. Sebastian sigue respondiendo desde su teléfono como siempre; Caliber ve todo en tiempo real y la IA pre-escribe las respuestas.

**Requisito clave (YA cumplido):** debe ser la app **WhatsApp Business** (cuenta de empresa), NO la app verde de consumidor. El número de Sebastian ya aparece como cuenta de empresa ✅.

Flujo resultante:
- Lead del anuncio escribe → entra a Caliber (webhook `messages`).
- La IA pre-escribe → Sebastian **aprueba/envía desde Caliber** o **responde desde el teléfono**.
- Lo que escribe en el teléfono se refleja en Caliber (webhook `smb_message_echoes`) → siempre sincronizado.
- Al conectar, Meta importa ~6 meses de historial 1:1.

Notas de Meta (sin bloqueos para este caso): la **elegibilidad la aprueba Meta** (antigüedad/calidad del número; ~7 días de uso activo en Business); hay que **abrir la app Business al menos cada ~13 días**; al conectar se **desvinculan** sesiones actuales de WhatsApp Web/Desktop; solo sincroniza chats **1:1** (no grupos); el número con coexistencia no recibe palomita azul. Como el lead **escribe primero**, se responde **libre dentro de la ventana de 24 h** (sin plantillas).

---

## Lo que necesito de su parte (en orden)

1. **Meta Business Manager** (el de Dragon Consultations). Tener el **Business ID**.
2. **App en Meta for Developers** → agregar el producto **WhatsApp**. (https://developers.facebook.com)
3. **Onboarding por COEXISTENCIA** (⚠️ NO borres el número de la app): hazlo a través de un **BSP que soporte coexistencia** — recomiendo **360dialog** o **Twilio**. Embedded Signup → ingresas el número → Meta muestra un **QR** → Sebastian lo escanea desde **WhatsApp Business → Ajustes** en el iPhone. El número queda conectado a la Cloud API **sin dejar de funcionar en su teléfono**, y se importa el historial. Anota el **`phone_number_id`** y el **WhatsApp Business Account ID**.
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

### B. Webhook (en Meta o en el panel del BSP)
1. Configura el webhook:
   - **Callback URL** = la URL del Worker
   - **Verify token** = el mismo `WHATSAPP_VERIFY`
   - Suscribe **`messages`** (leads que entran) **y `smb_message_echoes`** (respuestas que Sebastian escribe desde el teléfono) — y `history` si el BSP lo expone. El Worker ya maneja los tres.

### C. Conectar Caliber
Mándame la **URL del Worker** y el **`READ_TOKEN`** (no son la key secreta de Anthropic ni el token de WhatsApp — son seguros de compartir). Los pongo en `AGENT_WA_URL` / `AGENT_WA_KEY` y hago deploy. Listo: la bandeja se llena en vivo.

---

## Cómo se ve funcionando
- Un lead hace clic en el anuncio → escribe por WhatsApp → en **≤4 s** aparece en Caliber (Ad conversations).
- La IA ya dejó **redactada** la respuesta (NEPQ + HSTP). Sebastian: **Aprobar y enviar**, **editar**, o **Regenerar**.
- Marca 🔥 a los calientes → filtro "Hot only" para sentarse solo con esos.
- En modo `auto`, la IA responde sola y Sebastian solo entra a los calientes.

> Seguridad: la `READ_TOKEN` viaja en el navegador (es demo-grade). Para producción con muchos leads, se agrega login real. El token de WhatsApp y la key de Anthropic **nunca** salen del Worker.
