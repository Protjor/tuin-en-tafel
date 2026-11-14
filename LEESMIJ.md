# Tuin & Tafel

Recepten, moestuinzaden en zaaikalender in één app. Draait gratis op GitHub Pages.

- **config.js leeg** → demo: alles blijft in de browser van de bezoeker, met demobalk bovenaan.
- **config.js ingevuld** → echte app: aanmelden, alles centraal bewaard in Supabase (gratis plan), live gesynchroniseerd tussen toestellen.

## Live zetten met Supabase (eenmalig, ±15 minuten)

1. **Account en project**
   - Ga naar supabase.com → *Start your project* en maak een gratis account.
   - *New project*: naam `tuin-en-tafel`, kies een databankwachtwoord (bewaar het), regio **West EU (Ireland)** of **Central EU (Frankfurt)**.
   - Wacht tot het project klaar is (1–2 minuten).
2. **Databank opzetten**
   - Links: *SQL Editor* → *New query*.
   - Plak de volledige inhoud van `setup.sql` en klik op *Run*. Je ziet "Success".
3. **Aanmelden instellen**
   - *Authentication* → *Sign In / Providers* → zet **Allow new users to sign up** UIT (zo kan niemand zelf een account maken).
   - *Authentication* → *URL Configuration*:
     - Site URL: `https://protjor.github.io/tuin-en-tafel/`
     - Redirect URLs: voeg `https://protjor.github.io/tuin-en-tafel/` toe (nodig voor "wachtwoord vergeten").
   - *Authentication* → *Users* → *Add user* → *Create new user*: e-mailadres van SH + een wachtwoord, vink **Auto Confirm User** aan. Doe hetzelfde voor jezelf als je wilt meekijken.
4. **Sleutels**
   - *Project Settings* → *API* (of *Data API*): kopieer de **Project URL** en de **anon public** key.
   - Vul ze in `config.js` in (of geef ze aan Claude). Deze twee mogen publiek zijn; de gegevens zitten achter de login.
5. **Eerste keer aanmelden**
   - Open `https://protjor.github.io/tuin-en-tafel/`, meld aan.
   - ⚙ → *Voorbeeldrecepten laden* zet de 3 recepten (met foto's en de witloof-video) en 5 voorbeeldzaden in de databank. De voorbeeldzaden kan je daarna wissen met *Voorbeelden verwijderen* in Moestuin.

## Wakker houden

Een gratis Supabase-project pauzeert na een week zonder activiteit. De GitHub Action *Supabase wakker houden* (`.github/workflows/wakker-houden.yml`) stuurt elke dag één kleine vraag naar de databank. Controleer in de repo onder **Actions** dat ze groen is. GitHub zet geplande acties stil als er 60 dagen niets aan de repo verandert; je krijgt dan een mail en kan ze met één klik terug aanzetten.

Staat het project toch op pauze: Supabase-dashboard → project → *Restore project*.

## Gebruikers

Toevoegen of verwijderen: Supabase → *Authentication* → *Users*. Iedereen met een account ziet en bewerkt dezelfde recepten en zaden.

## Bestanden

- `index.html` – de app
- `config.js` – koppeling met Supabase
- `vendor/supabase.js` – Supabase-bibliotheek (lokaal, v2.45.4)
- `setup.sql` – databank, rechten, fotobucket
- `demo-backend.js`, `demo-overrides.js` – alleen gebruikt zolang config.js leeg is
- `starter/` – voorbeeldrecepten, foto's en video
