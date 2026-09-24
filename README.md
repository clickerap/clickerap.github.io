# Serge Clicker

Een klikspel over het netwerk van Serge: van patchkabel tot singulariteit. Gemaakt voor de klas, met een labo vol netwerkoefeningen (subnetten, een IOS-terminal, een cursus) tussen het klikken door.

Spelen: <https://clickerap.github.io/>

## Lokaal draaien

Het spel is een statische site zonder build-stap, maar gebruikt ES-modules. Die laden niet als je `index.html` los opent; je hebt een kleine webserver nodig.

```sh
npm start              # http://127.0.0.1:8000, Node 22 of nieuwer
# of, zonder Node:
python3 -m http.server
```

## Opbouw

| Map of bestand | Wat erin staat |
| --- | --- |
| `index.html`, `style.css` | De pagina en de opmaak. Geen framework. |
| `js/data/` | Alle inhoud als data: apparaten, upgrades, prestaties, buffs, de studieboom, het labo. Hier pas je de balans aan. |
| `js/state.js` | De spelstaat `G` en alles wat eruit volgt (`D`). Afgeleide waarden zet je nooit met de hand: je wijzigt bezit en roept `recompute()` aan. |
| `js/engine.js` | De spelklok: productie, buffs, gouden packets, storingen. |
| `js/save.js` | Opslaan, laden, nakijken en migreren van saves. |
| `js/ui/` | De interface: winkel, tabbladen, vensters, grafiek. |
| `js/minigames/` | Het labo. Elke opdracht heeft `render(root)`, optioneel `update(root)` en `stop()`; alleen `index.js` start timers. |
| `tools/` | Hulpscripts: een lokale server, de spelgids en de balanssimulatie. |
| `tests/` | Unit-tests (`tests/unit`) en browsertests (`tests/browser`). |
| `fonts/`, `img/` | IBM Plex (zelf gehost) en de foto's van Serge. |

## Testen

```sh
npm install
npx playwright install chromium   # eenmalig, voor de browsertests
npm test                          # unit-tests met de ingebouwde runner van Node
npm run test:browser              # het spel in Chromium, o.a. de bekende bugs
npm run lint                      # ESLint
```

Bij elke push draait GitHub Actions dezelfde controles, en kijkt of `SPELGIDS.md` nog klopt.

## Balans en spelgids

- `npm run balans` rekent door hoe snel een speler vooruitkomt: welk apparaat wanneer, en wanneer afstuderen loont. Draai hem na elke wijziging in `js/data/`.
- `npm run gids` maakt `SPELGIDS.md` opnieuw uit de databestanden. Let op: die gids verklapt alles, ook de verborgen dingen.

## Afspraken voor nieuwe code

- **Namen in het Nederlands.** Het spel is Nederlands, en het grootste deel van de code ook. Oudere Engelse namen in de kern (`buyBuilding`, `recompute`) blijven zoals ze zijn.
- **Tekst uit een save of van de speler nooit als HTML.** Gebruik `textContent`, of `esc()` uit `js/html.js` als het echt in een template moet.
- **Een save bevat alleen ruwe feiten.** Effecten en tellers worden bij het laden afgeleid. Verandert de vorm van de save, verhoog dan `SAVE_VERSION` in `js/state.js` en voeg een stap toe aan `MIGRATIES` in `js/save.js`.
- **Eén bron per feit.** Versienummer in `js/versie.js`, foto's in `js/data/uiterlijk.js`, drempels van de studie in `js/data/skilltree.js`.

## Publiceren

GitHub Pages publiceert de branch `main` rechtstreeks; er is geen build-stap.

## Licenties

IBM Plex valt onder de SIL Open Font License, zie `fonts/OFL.txt`.
