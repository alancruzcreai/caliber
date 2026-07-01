# Conectar el WhatsApp + agente IA a Caliber (línea en vivo)

Objetivo: que **cada lead que llega por los anuncios actuales** aparezca en Caliber **en tiempo real**, con la **respuesta ya redactada por la IA** (usando el PDF de ventas + todo el programa HSTP), y que Sebastian decida enviarla, editarla o descartarla — para sentarse solo con leads calientes listos para cerrar a **$2,200 USD**.

Número destino de los leads: **+1 (346) 247-4443**. Todo se trabaja **desde Caliber** — no se necesita ninguna app de WhatsApp en ningún teléfono para esta línea.

Yo (Claude Code) ya construí todo el código: el backend (`whatsapp-worker.js`) y la pantalla en Caliber (`inbox.html`). Lo que falta son pasos de cuenta/verificación que solo puede hacer el cliente — no puedo crear cuentas, recibir códigos de verificación en su teléfono, ni manejar sus credenciales.

Todo lo de abajo está verificado contra la documentación oficial de Meta y de Anthropic (jun-2026), no es información inventada.

---

## ¿El número necesita ser WhatsApp Business primero? — **No**
Confirmado en la documentación oficial de Meta: un número que **nunca ha estado en WhatsApp** se registra **directo** en la API (WhatsApp Business Platform / Cloud API) — de hecho es **más simple** que migrar un número que ya tiene historial, porque no hay que borrar ninguna cuenta antes.

El único requisito real: **el número debe poder recibir un código (SMS o llamada de voz)** — así es como Meta verifica que es suyo. Si +1 (346) 247-4443 es un número virtual, confirmar que puede recibir SMS/llamada real (no solo redirección) — es la única condición técnica no negociable.

*(Nota aparte: como Sebastian trabajará esta línea 100% desde Caliber y no desde una app en su teléfono, no aplica "Coexistencia" — esa función es solo para cuando alguien quiere seguir usando la app de WhatsApp Business en el teléfono a la vez que la API. Aquí no hace falta.)*

## ¿Yo (Alan) necesito ser administrador del Business Manager del cliente? — **No**
Meta tiene un flujo llamado **Embedded Signup** diseñado exactamente para esto: **el propio Sebastian (o quien administre el Business Manager) inicia sesión con SU cuenta de Facebook**, dentro de una ventana de Meta, y ahí mismo le otorga acceso a mi app. Yo nunca necesito ser admin de su cuenta — el acceso se lo da él directamente en ese momento.

## ¿Se necesita aprobación de Meta (App Review) para hablar con leads reales? — **No**
Como estoy usando la API para el propio negocio del cliente (no para revender a terceros), no se requiere "App Review" — eso solo aplica si yo ofreciera esto como producto a otras empresas. El único límite real es de volumen (ver abajo).

## Límite de mensajes (a tener en cuenta, no bloqueante hoy)
Una cuenta de negocio nueva/sin verificar empieza con un tope de **250 destinatarios únicos cada 24 h**. Sube automáticamente (a 2,000, luego más) cuando el negocio complete la **Verificación de Negocio de Meta** o mantenga buena calidad de mensajes por 30 días. Con el volumen actual de la campaña no es un problema — pero si el volumen de leads crece, avísame para gestionar la verificación a tiempo.

---

## Lo que necesito de su parte (en orden)

1. **Confirmar que +1 (346) 247-4443 puede recibir un SMS o llamada real** (no un número de solo-reenvío). Sin esto no se puede verificar.
2. **Sebastian (o quien administre el Meta Business Manager de Dragon Consultations) hace el Embedded Signup** — 5 minutos, se detalla abajo.
3. **Cuenta Cloudflare** (gratis) — para desplegar el backend (Worker).
4. **Cuenta y créditos en la consola de Anthropic** (la IA) — ver sección de precios abajo.
5. Mauricio mantiene los **anuncios apuntando a este número**.

## Paso a paso del Embedded Signup (lo hace Sebastian, 5 min)
1. Le mando un enlace que abre una ventana de Meta.
2. Inicia sesión con su propio Facebook/Meta.
3. Elige o crea su **Business Portfolio** (el de Dragon Consultations).
4. Crea la **cuenta de WhatsApp Business** (WABA) — nombre a mostrar: p. ej. "High Standard Traveler Program" o "Dragon Consultations".
5. Ingresa el número **+1 (346) 247-4443**.
6. Recibe el código por **SMS o llamada** y lo captura ahí mismo.
7. En la pantalla final, **aprueba darle acceso a mi app** ("caliber sebastian") sobre ese número — este es el paso que conecta todo con Caliber.

Con eso, mi lado (el Worker) completa el registro técnico y queda todo conectado — sin que el cliente tenga que tocar nada más.

---

## Despliegue (yo lo dejo listo; el cliente solo pega credenciales)

### A. Worker en Cloudflare
1. Cloudflare → **Workers & Pages** → Create Worker → pega `whatsapp-worker.js` → Deploy.
2. **KV**: Storage & Databases → KV → crea un namespace `CALIBER_CONVOS`. En el Worker → Settings → Bindings → agrega **KV Namespace** con **Variable name `CONVOS`** → el namespace creado.
3. Worker → Settings → **Variables and Secrets** (Secret = oculto; Text = variable normal):
   - `WHATSAPP_TOKEN` (Secret) — token permanente (se genera tras el Embedded Signup)
   - `WHATSAPP_PHONE_ID` (Text) — el `phone_number_id` de +1 346 247 4443
   - `WHATSAPP_VERIFY` (Secret) — una palabra que tú inventes (ej. `caliber-verify-9f2`)
   - `META_APP_SECRET` (Secret) — App Secret de la app de Meta
   - `ANTHROPIC_API_KEY` (Secret) — key de Anthropic (ver abajo)
   - `READ_TOKEN` (Secret) — otra palabra que inventes (Caliber la usa para leer/enviar)
   - `MODE` (Text) — `assist` (recomendado; la IA redacta y Sebastian aprueba) o `auto`
   - `MODEL` (Text) — `claude-sonnet-5` (recomendado, ver precios abajo)
   - `MODEL_FALLBACK` (Text) — `claude-haiku-4-5` (ya viene por defecto en el código: si el modelo principal falla —p. ej. saldo bajo— reintenta solo con este modelo más barato, para que la conversación **nunca se quede sin respuesta**)
   - `CAMPAIGN_AD_IDS` (Text, opcional) — ids de anuncios de la campaña para filtrar
4. Deploy. Copia la **URL del Worker** (`https://...workers.dev`).

### B. Webhook
Configura el webhook (en Meta o en el panel del proveedor que uses):
- **Callback URL** = la URL del Worker
- **Verify token** = el mismo `WHATSAPP_VERIFY`
- Suscribe el campo **`messages`**.

### C. Conectar Caliber
Mándame la **URL del Worker** y el **`READ_TOKEN`** (no son la key de Anthropic ni el token de WhatsApp — son seguros de compartir). Los pongo en `AGENT_WA_URL` / `AGENT_WA_KEY` y hago deploy. Con eso, la bandeja de Caliber se llena en vivo.

---

## Precios de la IA — verificado (jun-2026), sin inventar nada

**No existe una versión gratuita permanente de la API de Claude.** Es importante ser claro con esto: la suscripción a Claude.ai (el chat) **no incluye** acceso a la API — son cosas separadas y facturas separadas, confirmado directo en la documentación de Anthropic. Nuevas cuentas reciben "una pequeña cantidad de créditos gratis para probar" (Anthropic no publica el monto exacto), pero después de eso el uso se cobra.

**La buena noticia: al volumen actual, el costo real es mínimo.**

| Modelo | Precio (entrada / salida por 1M tokens) | Recomendación |
|---|---|---|
| **Sonnet 5** ⭐ | $2 / $10 (precio de lanzamiento hasta 31-ago-2026; luego $3/$15) | **El que recomiendo usar ahora** — el mejor balance calidad/precio mientras dura esta promoción |
| Haiku 4.5 | $1 / $5 | Respaldo automático si el saldo se agota a media conversación (ya configurado en el código) |
| Opus 4.8 | $5 / $25 | Opcional, solo si quieres el máximo poder de cierre en los leads más calientes |

Con el **cache de prompt** que ya activé en el Worker, cada turno de la conversación cuesta ~10% de lo normal. Una conversación completa de venta sale en **centavos de dólar**. Frente a un cierre de $2,200, el costo de la IA es irrelevante.

**Para que nunca se quede sin saldo a media conversación** — dos capas de protección, ambas ya implementadas/documentadas:
1. **Auto-recarga real de Anthropic** (confirmado en su documentación oficial): en Console → Billing, activas "Auto-reload" y defines: *"cuando el saldo baje de $X, recarga $Y automáticamente."* Recomendado: recargar $10 cada vez que baje de $5 — a este volumen, dura meses.
2. **Respaldo automático en el código**: si por cualquier motivo el modelo principal falla (saldo en cero, error temporal), el Worker reintenta automáticamente con Haiku 4.5 (más barato) antes de rendirse — así ninguna conversación se queda sin respuesta.

---

## Cómo se ve funcionando
- Un lead hace clic en el anuncio → escribe por WhatsApp al +1 346 247 4443 → en **≤4 s** aparece en Caliber (Ad conversations).
- La IA ya dejó **redactada** la respuesta (NEPQ + todo el conocimiento del HSTP). Sebastian: **Aprobar y enviar**, **editar**, o **Regenerar** — todo desde Caliber.
- Marca 🔥 a los calientes → filtro "Hot only" para sentarse solo con esos.
- En modo `auto`, la IA responde sola y Sebastian solo entra a los que ya están calientes.

> Seguridad: la `READ_TOKEN` viaja en el navegador (nivel demo). Para producción con mucho volumen, se agrega un login real. El token de WhatsApp y la key de Anthropic **nunca** salen del Worker — Caliber nunca los ve.
