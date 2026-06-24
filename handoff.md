# ElegAuto — Handoff

Sito vetrina one-page per **ElegAuto**, salone d'auto a Mazzarino (CL).
Obiettivo: trasmettere **credibilità, affidabilità e un'immagine premium** ("Eleganza · Cura · Distinzione"), con animazioni cinematografiche moderne.

## Stato attuale
Sito **funzionante e completo nella struttura**. Singolo file autonomo, nessuna build.

### Stack
- `index.html` — HTML + CSS custom (`<style>`) + JS vanilla.
- **Tailwind compilato** (non più CDN): `assets/styles.css` minificato (~20 KB), generato da `src/input.css` + `tailwind.config.js`. JS vanilla, nessun framework runtime.
- Font: Bodoni Moda (display) · Cormorant Garamond (script) · Jost (sans).

#### Build CSS (Tailwind)
Dopo aver aggiunto/rimosso classi Tailwind nell'HTML, rigenerare il CSS:
```
npm install        # solo la prima volta
npm run build:css  # → assets/styles.css (minificato)
npm run watch:css  # opzionale: ricompila in automatico
```
Le classi vengono "tree-shakate" leggendo `index.html` (vedi `content` in `tailwind.config.js`). Se aggiungi nuovi file HTML, includili in `content`.

#### SEO / social
- Meta Open Graph + Twitter card, favicon SVG inline, `theme-color`, canonical e **JSON-LD `AutoDealer`** (indirizzo, telefono, orari, geo, social) nel `<head>`.
- ⚠️ Sostituire il dominio placeholder `https://www.elegauto.it` con quello reale (canonical, OG, Twitter, JSON-LD).
- `og:image` punta a `assets/img/car-1.jpg`: sostituire con una cover dedicata 1200×630 (`assets/img/og-cover.jpg`) quando disponibile.

### Tema (dal logo)
- Verde smeraldo profondo (`#04150E` → `#0F5236`) + oro metallico (`#C9A24B`, light `#F0D78A`, deep `#8A6420`).
- Avorio testo `#F6F1E4`, muted `#C9C3B2`.

### Struttura sezioni (in ordine)
1. **Navbar** sticky con "Chiama ora" (magnetico). Logo ElegAuto oro statico.
2. **Hero** — titolo a comparsa lettera per lettera, parola fantasma "ELEG" che scala con lo scroll, e a destra (sotto il testo su mobile) la **vetrina auto** (`#heroDeck`):
   - **Card che scorrono verso destra** (`.deck-track`, marquee CSS `deckScroll` ~56s, in pausa quando si è sopra una card): **solo le 9 foto frontali** `car-18/3/22/20/6/11/17/10/7` (Panda rossa, 500e, Audi A3, Abarth 500, 3008, Panda bianca, Golf, Giulietta, Jeep), duplicate per loop continuo. Le altre foto (retro/interni/dettagli) sono escluse di proposito. Maschera ai bordi (`.deck-mask`).
   - **Riquadro oro in alto a destra** con il **nome dell'auto** (`.deck-badge`, nel `<figcaption>` di ogni card).
   - **Sfumatura nella parte bassa** della card (`.deck-card::after`).
   - **Effetti sulla singola card** (non sull'intero deck): **tilt 3D "a gravità" verso il mouse** + scale 1.07 (JS `pointermove` per card), **cornice oro accesa** + **ombra** all'hover. Disattivati su touch / `prefers-reduced-motion`.
   - **Click su una foto → finisce nel background dell'intera sezione hero** (`#heroBg`, crossfade in opacità). **Default background = `car-2`** (Golf R-Line, foto del faro, non frontale). Lo sfondo è scurito da un gradiente sopra l'immagine così il testo resta leggibile.
   - **Scritta centrale** sovrapposta: "La nostra selezione" + "USATO GARANTITO · PRONTA CONSEGNA".
   - La cue **"SCORRI"** è `hidden lg:flex` (nascosta su mobile) per non sovrapporsi al deck.
   - Per cambiare le foto: modificare i due set identici di `<figure class="deck-card">` con relativo `.deck-badge` (devono restare uguali per il loop senza salti).
   - ⚠️ Il **pedale acceleratore + contagiri** NON è nell'hero: è nella sezione narrativa, sotto **Sportiva tedesca** (vedi punto 3).
3. **Sezione video narrativa** (`#expandVid`, 300vh, sticky) — la più complessa:
   - Fase 1: "Entra da ElegAuto", lo schermo video si espande (grande, non full-screen).
   - Fase 2: scivola a destra, a sinistra appare **"Chiamaci e trova l'auto che fa al caso tuo"** (link tel, cliccabile solo quando visibile) + righe dorate che sfrecciano.
   - Fase 3: prende forma **iPhone** (notch/bezel) + sfondo **favo di esagoni interattivo** (segue il mouse).
   - **Selezione a categorie** (tab + frecce ‹ ›): catalogo in `CATALOG` nel JS.
     - *Showroom 360°*: salone.mp4, entrata.mp4
     - *Vetture selezionate*: Mercedes-AMG A45 4MATIC (auto2.mp4), Alfa Romeo Giulietta 1.4 MultiAir (auto3.mp4)
   - Soprtitolo = categoria fissa; titolo grande = "SPORTIVA TEDESCA"/"ICONA ITALIANA"; sotto nome + specifiche.
   - **Contagiri live + piccolo pedale** (`#pedalRig`): **fuori dal pannello**, `position:absolute` in basso a sinistra del contenitore sticky (`left-[6%] bottom-[6%]`), **sotto e senza sovrapporsi all'iPad**. **Niente box dorato** e **niente tasto mute**: si fonde con gli esagoni grazie a un **"buco" nero sfumato** (`.pedal-well`). Layout **verticale**: contagiri sopra (`w-[124px]`), **pedale piccolo sotto** (`#pedalBtn` `width:58px`) — il contagiri è il protagonista, il pedale poco invasivo. **Opacità bassa**: `e3 * 0.6` (più trasparente del pannello). Compare **solo sulla Sportiva tedesca** (A45, `pedal: true` in `CATALOG`); `renderCat()` lo mostra/nasconde con `hidden`.
     - **Contagiri** (`#tachNeedle`): lancetta pilotata in tempo reale dall'**ampiezza audio reale dell'A45** via WebAudio `AnalyserNode`. Ticks 0–8 e redline generati in JS.
     - **Pedale** (`#pedalBtn`): premi/tieni premuto (mouse, touch, **Space/Enter**) → il pad si **schiaccia in dentro** (`translateY + scale`, non rotazione laterale), parte la sgasata + bagliore (`assets/audio/rev-1…5.mp3` a rotazione). Pad **dritto, senza asta e senza fiamma**.
     - **Sblocco audio**: l'AudioContext nasce al primo tocco (gesto utente) → niente blocco autoplay. **Mute rimosso** (l'audio parte solo premendo). Fallback sintetizzato WebAudio. Rispetta `prefers-reduced-motion`.
     - ⚠️ Classi Tailwind del pedale = **arbitrary values** (`w-[124px]`, `bottom-[6%]`…): dopo modifiche **rilanciare `npm run build:css`**. La larghezza del pedale è fissata in CSS (`#pedalBtn{ width:58px }`, vince sulle classi per specificità id).
   - Scroll su → reset a Showroom 360° (il pedale si rinasconde).
4. **Fascia kinetica** ELEGANZA · CURA · DISTINZIONE.
5. **Perché noi / "La fiducia…"** (`#valori`) — 6 card con sheen dorato, hover lift + **tilt 3D al mouse**, orb, shimmer sul titolo, "sweep" dorato all'ingresso.
6. **L'esperienza** — dettagli con hotspot (cerchi/motore/fari).
7. **Tachimetro + percorso** (`#motionDuo`) — gauge che conta 0→100% e linea salone→casa disegnata allo scroll.
8. **Chi siamo** — storia 2026, scheda logo con sheen automatico, statistica 100% animata.
9. **Recensioni** — 3 reali (Peppuzzo, Antonino Fabio, Gaetano Siciliano) + 3 video festeggiamenti (spumante).
10. **Contatti** — telefono, indirizzo, orari, Instagram, TikTok, WhatsApp, mappa Google.
11. **Footer** + bottone "Chiama" sticky su mobile.

### Interazioni globali
- Cursore custom: freccia dorata che cresce leggermente vicino agli elementi.
- Barra di progresso scroll dorata in cima.
- Bottoni magnetici, reveal allo scroll, conteggio animato.
- Tutto rispetta `prefers-reduced-motion`.

### Dati reali inseriti
- Tel: **+39 346 017 6075** · Viale della Regione 83, Mazzarino (CL)
- Orari: Lun–Sab 09:00–13:00 · 15:30–19:30
- Instagram `@elegauto.official` · TikTok `elegauto_`
- Attivi dal 2026. Usato garantito/controllato, finanziamenti, test drive, consegna ovunque.

### Asset
- `assets/video/`: `entrata.mp4` (ingresso), `salone.mp4` (showroom), `auto2.mp4` (Mercedes), `auto3.mp4` (Giulietta), `feedback-1/2/3.mp4` (festeggiamenti). Tutti convertiti in **H.264** (gli originali iPhone erano HEVC, non riproducibili nei browser).
- `assets/img/`: `car-1.jpg` … `car-22.jpg` (foto auto — `car-1.jpg` usata come `og:image`). In **vetrina hero** `#heroDeck` solo le **9 frontali**: `car-18/3/22/20/6/11/17/10/7`. **`car-2`** (Golf, faro) = **background di default** della hero. Frontali = 3/6/7/10/11/17/18/20/22; retro = 4/5/8/12/15/16; interni = 9/13/14/21; dettagli = 1 (gomma), 2/19 (faro/fiancata). Le non-frontali non sono nel deck di proposito.
- `assets/audio/`: `rev-1…5.mp3` (+ `.m4a` fallback) — le **sgasate dell'A45** usate dal pedale (ora nella Sportiva tedesca), ritagliate dal video `IMG_5282.MOV` ai tempi: rev-1 2.39→5.28, rev-2 5.32→8.65, rev-3 8.66→11.49, rev-4 11.46→13.88, rev-5 13.89→17.95. Normalizzate (loudnorm) + micro-fade.
  - `full.mp3` = audio completo; `trimmer.html` = mini-editor con forma d'onda per riscegliere i tagli a orecchio; `preview.html` = pagina d'ascolto. **Tool di sviluppo: eliminabili prima del deploy.**
- `assets/video/salone-hevc-original.mp4`: backup HEVC, eliminabile.

## Come lavorare
- **Server locale** (il pannello anteprima integrato non serve `assets/`):
  ```
  cd /Users/biagio/Desktop/Cloude && python3 -m http.server 8765
  ```
  Aprire **http://localhost:8765** (hard refresh Cmd+Shift+R dopo le modifiche).
- **Conversione video** HEVC→H.264 (serve ffmpeg, già installato via Homebrew in `/opt/homebrew/bin`):
  ```
  ffmpeg -i input.MOV -c:v libx264 -crf 22 -pix_fmt yuv420p -an -movflags +faststart -vf "scale='min(1080,iw)':-2" output.mp4
  ```
- Le sorgenti video nel markup hanno `?v=N` per bustare la cache del browser quando si rigenerano.

## Obiettivi / prossimi passi
- [x] **Hero**: **vetrina** (`#heroDeck`) con **9 foto frontali**, **riquadro oro col nome** in alto a dx, sfumatura in basso, effetti **per-card** (tilt "gravità", cornice oro, ombra). **Click → la foto diventa il background dell'intera hero** (`#heroBg`, default `car-2` Golf/faro). "SCORRI" nascosto su mobile.
- [x] **Pedale acceleratore**: pad dritto, senza asta/fiamma, si schiaccia in dentro. Nella **Sportiva tedesca** (A45), **in basso**, **senza box dorato e senza mute**, fuso con gli esagoni. **Rimpicciolito e sotto il contagiri** (layout verticale, `width:58px`), **opacità bassa** (`e3*0.6`). Per estrarre nuove sgasate: `assets/audio/trimmer.html`.
- [ ] Verificare/affinare tempistiche della sezione narrativa `#expandVid` (fasi 1-2-3) su schermi diversi.
- [ ] Eventuale **galleria "Show"** clienti (foto in `assets/img/` o altre).
- [ ] Sostituire P.IVA segnaposto nel footer con quella reale.
- [ ] Aggiungere altre vetture al `CATALOG` man mano che arrivano i video.
- [ ] Deploy: essendo statico, pubblicabile su qualsiasi hosting (Netlify, Vercel, GitHub Pages, hosting tradizionale) caricando l'intera cartella.

## Note tecniche
- Logica di scroll centralizzata in un unico handler `onScroll` (con `requestAnimationFrame`).
- `CATALOG` (oggetto JS) governa video + testi della selezione; per aggiungere auto basta estenderlo.
- Effetto "sweep" dorato sostituisce le vecchie tende sulle sezioni `#valori` e `#recensioni`.
