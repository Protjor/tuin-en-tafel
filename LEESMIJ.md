# Tuin & Tafel · Demo op GitHub Pages

Deze map is de demo-versie. Ze werkt zonder server, zonder login en zonder Supabase.

- Bij het eerste bezoek staan er 3 voorbeeldrecepten en 5 voorbeeldzaden klaar.
- Bezoekers kunnen alles uitproberen. Hun wijzigingen blijven alleen in hun eigen browser.
- Met **Demo herstellen** begint de demo opnieuw.

## Online zetten (zonder git, alles in de browser)

1. Maak een account op github.com, of meld je aan.
2. Maak een nieuwe repository aan:
   - Klik rechtsboven op **+ → New repository**.
   - Naam: `tuin-en-tafel`.
   - Kies **Public** (gratis GitHub Pages vereist dat).
   - Klik **Create repository**.
3. Zet de bestanden erin:
   - Klik op **uploading an existing file**.
   - Sleep **de inhoud** van deze map in het venster: `index.html`, de `.js`-bestanden, de pictogrammen, `manifest.webmanifest` en de map `starter`.
   - Sleep de bestanden zelf, niet de map `demo` eromheen.
   - Klik **Commit changes**.
4. Zet de website aan:
   - Ga naar **Settings → Pages**.
   - Bij *Source* kies je **Deploy from a branch**.
   - Kies branch **main** en map **/ (root)**.
   - Klik **Save**.
5. Na 1 à 2 minuten staat de demo op `https://JOUW-GEBRUIKERSNAAM.github.io/tuin-en-tafel/`. De link verschijnt bovenaan in **Settings → Pages**.

## Bijwerken

Upload de gewijzigde bestanden opnieuw via **Add file → Upload files**. Bestaande bestanden worden overschreven. De site is binnen een paar minuten bijgewerkt.

## Eigen domein (optioneel)

Je kunt bv. `demo.jouwdomein.be` gebruiken:

1. Vul het domein in onder **Settings → Pages → Custom domain**.
2. Maak bij je domeinbeheerder (bv. Easyhost) een CNAME-record aan voor `demo` dat verwijst naar `JOUW-GEBRUIKERSNAAM.github.io`.
3. Vink daarna **Enforce HTTPS** aan.

## Goed om te weten

- De code is openbaar zichtbaar in de repository. Er staan geen sleutels of persoonlijke gegevens in.
- De browser bewaart maar een paar MB. Na een tiental eigen foto's kan het geheugen vol raken. De demo meldt dat dan, en "Demo herstellen" maakt weer plaats.
- De volledige versie (login, live synchronisatie tussen toestellen, foto's in de cloud) zit in `tuin-en-tafel.zip` met Supabase.
