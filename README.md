# GEAGROOM — jednostavno uređivanje + Netlify

Ova verzija postojeće GEAGROOM stranice pripremljena je tako da se sadržaj može mijenjati kroz jednostavan CMS, bez uređivanja HTML-a.

## Što sada možeš uređivati

U `/admin/` možeš mijenjati:
- naziv salona i osnovne kontakt podatke
- adresu i telefon
- tekstove na početnoj stranici
- tekst „O meni”
- usluge i njihove detaljne opise
- cijene i dodatne usluge
- fotografiju početne stranice
- galeriju: dodavanje, brisanje i zamjenu fotografija
- opise i kategorije galerije

Promjene se spremaju u GitHub, a Netlify ih automatski objavljuje.

## 1. GitHub

1. Otvori https://github.com/ i prijavi se.
2. Napravi novi repository, npr. `geagroom-web`.
3. Repository može biti **Private**.
4. U njega učitaj sve datoteke iz ovog paketa tako da `index.html` bude u glavnom direktoriju repozitorija.
5. Provjeri da postoje:
   - `index.html`
   - `script.js`
   - `styles.css`
   - `content/site.json`
   - `admin/index.html`
   - `admin/config.yml`
   - `netlify.toml`

## 2. Netlify

1. Otvori https://app.netlify.com/
2. Odaberi **Add new project / Import an existing project**.
3. Odaberi **GitHub**.
4. Odaberi repository `geagroom-web`.
5. Kao publish directory ostavi `.`.
6. Build command ostavi prazan.
7. Deploy.

Stranica će dobiti besplatnu Netlify adresu, npr. `neki-naziv.netlify.app`.

## 3. Uključi uređivanje stranice

Na Netlify projektu:

1. Otvori **Integrations / Identity** i uključi **Netlify Identity**.
2. U postavkama registracije preporuka je **Invite only**.
3. U dijelu **Services** uključi **Git Gateway**.
4. Pozovi svoj e-mail kao korisnika.
5. Nakon prihvata poziva otvori:
   `https://TVOJA-NETLIFY-ADRESA.netlify.app/admin/`

Tamo se prijaviš i vidiš GEAGROOM uređivač.

## 4. Kako kasnije mijenjaš cijenu ili sliku

Ne diraš HTML.

Otvori:
`TVOJA-NETLIFY-ADRESA.netlify.app/admin/`

Zatim:
- **Cjenik** → promijeni cijenu → **Publish**
- **Usluge** → promijeni opis → **Publish**
- **Galerija** → dodaj ili zamijeni sliku → **Publish**
- **Osnovni podaci** → promijeni telefon/adresu → **Publish**

Nakon objave Netlify automatski osvježi web.

## 5. Kontakt obrazac

Obrazac za rezervaciju pripremljen je kao Netlify Form. Nakon prve objave možeš u Netlifyju uključiti e-mail obavijesti za nove prijave.

## 6. Google

Stranica već ima:
- Google Maps poveznicu za adresu
- osnovne SEO podatke
- LocalBusiness strukturirane podatke
- `robots.txt`
- `sitemap.xml`

Za pojavljivanje u Google rezultatima preporučuje se nakon objave dodati domenu u Google Search Console i poslati sitemap.

## Važno

`content/site.json` je glavni izvor sadržaja. Ako nešto promijeniš kroz `/admin/`, CMS će napraviti promjenu u GitHubu, a Netlify će je automatski objaviti.

Dizajn, animacije i struktura stranice ostaju odvojeni od sadržaja koji uređuješ.
