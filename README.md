# 27°Corso Sergenti Antares II – Riassunti & Quiz

Sito statico con simulatore di quiz **offline-first (PWA)** per il 27° Corso Sergenti – *Antares II*.

## Struttura
- `index.html` (entry point)
- `data/` (domande in JSON)
- `img/` (asset e icone PWA)
- `service-worker.js` (cache shell/dati/immagini)
- `manifest.json` (metadati PWA)

## Sviluppo
Apri semplicemente `index.html` in un browser moderno.  
Il service worker si registra in automatico.

## Deploy su GitHub Pages
Impostazioni → Pages → **Deploy from a branch** → `main` (Root).  
Dopo ogni push, la pagina viene aggiornata.

## Licenza
MIT
