# Activar el agente de IA real para TODO el mundo

Hoy el chat (`agent.html`) corre un **demo guionizado** cuando no hay IA conectada.
Para que el **cliente y todo el equipo** —desde cualquier país— hablen con el
**agente real de Claude** (entrenado en NEPQ + el programa HSTP) con solo abrir el
link, hay que prender un **proxy**: un endpoint chiquito que guarda **una sola
API key** del lado del servidor. La key nunca vive en el sitio ni en el repo.

Tiempo: ~10 minutos. No se necesita terminal.

---

## Qué necesitas antes de empezar
- Una **API key de Anthropic** con créditos (la de console.anthropic.com, empieza con `sk-ant-`).
- Una cuenta **Cloudflare** gratis (cloudflare.com → Sign up). El plan gratis sobra.

> Yo (Claude Code) **no** puedo crear la cuenta ni manejar tu key — eso lo haces tú.
> Yo ya dejé listo el código del proxy (`cloudflare-worker.js`) y el sitio.

---

## Paso 1 — Crear el Worker
1. Entra a Cloudflare → menú **Workers & Pages** → **Create application** → **Create Worker**.
2. Ponle nombre (ej. `caliber-agent`) → **Deploy** (despliega el ejemplo por default).
3. Click en **Edit code**.
4. Borra todo el código de ejemplo y **pega el contenido completo de** `cloudflare-worker.js`
   (está en la raíz del repo / proyecto Caliber).
5. Arriba a la derecha → **Deploy**.

## Paso 2 — Guardar la key como SECRET
1. En el Worker → pestaña **Settings** → **Variables and Secrets**.
2. **Add** → tipo **Secret** (no "Text"):
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** tu `sk-ant-...`
3. (Opcional) Add → tipo **Text**: `MODEL` = `claude-sonnet-4-6`
   (o `claude-opus-4-8` si quieres el modelo más potente; cuesta más por mensaje).
4. **Deploy / Save**.

## Paso 3 — Copiar la URL del Worker
1. En la pestaña del Worker verás la URL pública, algo como:
   `https://caliber-agent.TU-CUENTA.workers.dev`
2. **Cópiala y mándamela por aquí.**
   La URL **no es secreta** — es solo la puerta de entrada; la key sigue escondida
   dentro de Cloudflare. La pego en el sitio (`window.AGENT_API_URL`) y hago deploy.

Listo: en cuanto la cablee, cualquiera que abra
**https://alancruzcreai.github.io/caliber/agent.html** habla con el agente real,
en tiempo real, sin pegar nada.

---

## Cómo sé que quedó
- Arriba del chat la pastilla pasa de `● Demo mode` (gris) a `● Live · Claude` (verde).
- El panel derecho dice "Real AI is live… no key, no setup".
- Las respuestas dejan de ser las frases enlatadas y empiezan a usar NEPQ + los SOPs
  del programa (Bare Minimum, hidratación, Isabell, etc.).

## Costo y control
- Cada mensaje consume tokens de la API, cobrados a **tu** key en Cloudflare.
  Para un demo con el cliente + equipo son centavos. Con Sonnet, ~muchos miles de
  mensajes por unos pocos dólares.
- El proxy solo acepta llamadas desde el dominio de Caliber (lista `ALLOWED_ORIGINS`
  dentro de `cloudflare-worker.js`) para que otros sitios no quemen tus créditos.
  Si algún día mueves el dashboard a un dominio propio, agrégalo a esa lista y vuelve
  a hacer Deploy del Worker.
- Si quieres apagarlo: borra el Worker en Cloudflare, o vacía `AGENT_API_URL` en el
  sitio → vuelve solito al demo.

## Seguridad
- La key **solo** existe como Secret en Cloudflare. No está en GitHub, no se manda al
  navegador, no aparece en el código del sitio.
- El system prompt (NEPQ + HSTP) sí viaja del navegador al proxy: no es secreto, es el
  método. Si en producción masiva quieres blindarlo, se mueve el prompt al Worker.
