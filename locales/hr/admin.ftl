### Lokalizacija za Administraciju

## Općenito
general-notAvailable = Nije dostupno
general-none = Nijedan
general-noTextContent = Nema tekstualnog sadržaja
general-archived = Arhivirano

## Status Priče
storyStatus-open = Otvoreno
storyStatus-closed = Zatvoreno
storyStatus-archiving = Arhiviranje
storyStatus-archived = Arhivirano
storyStatus-unarchiving = De-arhiviranje

## Uloge
role-admin = Administrator
role-moderator = Moderator
role-siteModerator = Moderator Stranice
role-organizationModerator = Moderator Organizacije
role-staff = Osoblje
role-member = Član
role-commenter = Komentator

role-plural-admin = Administratori
role-plural-moderator = Moderatori
role-plural-staff = Osoblje
role-plural-member = Članovi
role-plural-commenter = Komentatori

comments-react =
  .aria-label = {$count ->
    [0] {$reaction} komentar od {$username}
    *[other] {$reaction} ({$count}) komentara od {$username}
  }
comments-reacted =
  .aria-label = {$count ->
    [0] {$reaction} komentar od {$username}
    [one] {$reaction} komentar od {$username}
    *[other] {$reaction} ({$count}) komentara od {$username}
  }

## Komponente
admin-paginatedSelect-filter =
  .aria-label = Filtriraj rezultate

## Statusi Korisnika
userStatus-active = Aktivno
userStatus-banned = Zabranjeno
userStatus-siteBanned = Zabranjeno na stranici
userStatus-banned-all = Zabranjeno (sve)
userStatus-banned-count = Zabranjeno ({$count})
userStatus-suspended = Suspendirano
userStatus-premod = Uvijek pre-moderiraj
userStatus-warned = Upozoreno

# Queue Sort
queue-sortMenu-newest = Najnovije
queue-sortMenu-oldest = Najstarije

## Navigation
navigation-moderate = Moderiraj
navigation-community = Zajednica
navigation-stories = Priče
navigation-configure = Konfiguriraj
navigation-dashboard = Nadzorna ploča
navigation-reports = DSA Izvješća

## User Menu
userMenu-signOut = Odjava
userMenu-viewLatestRelease = Pogledaj najnovije izdanje
userMenu-reportBug = Prijavi grešku ili daj povratnu informaciju
userMenu-popover =
  .description = Dijalog korisničkog izbornika s povezanim vezama i radnjama

## Restricted
restricted-currentlySignedInTo = Trenutno prijavljen na
restricted-noPermissionInfo = Nemate dopuštenje za pristup ovoj stranici.
restricted-signedInAs = Prijavljeni ste kao: <strong>{ $username }</strong>
restricted-signInWithADifferentAccount = Prijavite se s drugim računom
restricted-contactAdmin = Ako mislite da je ovo greška, kontaktirajte svog administratora za pomoć.

## Login

# Sign In
login-signInTo = Prijavite se na
login-signIn-enterAccountDetailsBelow = Unesite podatke o računu ispod

login-emailAddressLabel = Email adresa
login-emailAddressTextField =
  .placeholder = Email adresa

login-signIn-passwordLabel = Lozinka
login-signIn-passwordTextField =
  .placeholder = Lozinka

login-signIn-signInWithEmail = Prijavite se s emailom
login-orSeparator = Ili
linkAccount-useDifferentEmail = Koristite drugu email adresu

## Configure

configure-experimentalFeature = Eksperimentalna značajka

configure-unsavedInputWarning = Upozorenje o nespremljenim unosima

configure-sideBarNavigation-general = Općenito
configure-sideBarNavigation-authentication = Autentifikacija
configure-sideBarNavigation-moderation = Moderacija
configure-sideBarNavigation-moderation-comments = Komentari
configure-sideBarNavigation-moderation-users = Korisnici
configure-sideBarNavigation-organization = Organizacija
configure-sideBarNavigation-moderationPhases = Faze moderacije
configure-sideBarNavigation-advanced = Napredno
configure-sideBarNavigation-email = Email
configure-sideBarNavigation-bannedAndSuspectWords = Zabranjene i sumnjive riječi
configure-sideBarNavigation-slack = Slack
configure-sideBarNavigation-webhooks = Webhooks

configure-sideBar-saveChanges = Spremi promjene
configure-configurationSubHeader = Konfiguracija
configure-onOffField-on = Uključeno
configure-onOffField-off = Isključeno
configure-radioButton-allow = Dozvoli
configure-radioButton-dontAllow = Ne dozvoli

### Moderation Phases

configure-moderationPhases-generatedAt = KLJUČ GENERIRAN NA:
configure-moderationPhases-phaseNotFound = Vanjska faza moderacije nije pronađena
configure-moderationPhases-experimentalFeature = Eksperimentalna značajka
configure-moderationPhases-header-title = Faze moderacije
configure-moderationPhases-description = Opis
configure-moderationPhases-addExternalModerationPhaseButton = Dodaj vanjsku fazu moderacije
configure-moderationPhases-moderationPhases = Faze moderacije
configure-moderationPhases-name = Ime
configure-moderationPhases-status = Status
configure-moderationPhases-noExternalModerationPhases = Nema vanjskih faza moderacije
configure-moderationPhases-enabledModerationPhase = Omogućena faza moderacije
configure-moderationPhases-disableModerationPhase = Onemogući fazu moderacije
configure-moderationPhases-detailsButton = Detalji <icon></icon>
configure-moderationPhases-addExternalModerationPhase = Dodaj vanjsku fazu moderacije
configure-moderationPhases-updateExternalModerationPhaseButton = Ažuriraj detalje
configure-moderationPhases-cancelButton = Otkaži
configure-moderationPhases-format = Format tijela komentara
configure-moderationPhases-endpointURL = URL za povratni poziv
configure-moderationPhases-timeout = Vremensko ograničenje
configure-moderationPhases-timeout-details = Detalji vremenskog ograničenja
configure-moderationPhases-format-details = Detalji formata
configure-moderationPhases-format-html = HTML
configure-moderationPhases-format-plain = Običan tekst
configure-moderationPhases-endpointURL-details = Detalji URL-a za povratni poziv
configure-moderationPhases-configureExternalModerationPhase = Konfiguriraj vanjsku fazu moderacije
configure-moderationPhases-phaseDetails = Detalji faze
configure-moderationPhases-signingSecret = Tajni potpis
configure-moderationPhases-signingSecretDescription = Opis tajnog potpisa
configure-moderationPhases-dangerZone = Opasna zona
configure-moderationPhases-rotateSigningSecret = Rotiraj tajni potpis
configure-moderationPhases-rotateSigningSecretDescription = Opis rotacije tajnog potpisa
configure-moderationPhases-rotateSigningSecretButton = Rotiraj tajni potpis

configure-moderationPhases-disableExternalModerationPhase = Onemogući vanjsku fazu moderacije
configure-moderationPhases-disableExternalModerationPhaseDescription = Opis onemogućavanja vanjske faze moderacije
configure-moderationPhases-disableExternalModerationPhaseButton = Onemogući fazu
configure-moderationPhases-enableExternalModerationPhase = Omogući vanjsku fazu moderacije
configure-moderationPhases-enableExternalModerationPhaseDescription = Opis omogućavanja vanjske faze moderacije
configure-moderationPhases-enableExternalModerationPhaseButton = Omogući fazu
configure-moderationPhases-deleteExternalModerationPhase = Izbriši vanjsku fazu moderacije
configure-moderationPhases-deleteExternalModerationPhaseDescription = Opis brisanja vanjske faze moderacije
configure-moderationPhases-deleteExternalModerationPhaseButton = Izbriši fazu
configure-moderationPhases-rotateSigningSecretHelper = Pomoć za rotaciju tajnog potpisa
configure-moderationPhases-expiresOldSecret = Istek starog tajnog potpisa
configure-moderationPhases-expiresOldSecretImmediately = Odmah
configure-moderationPhases-expiresOldSecretHoursFromNow = Istek starog tajnog potpisa za nekoliko sati
configure-moderationPhases-rotateSigningSecretSuccessUseNewSecret = Uspješna rotacija, koristite novi tajni potpis
configure-moderationPhases-confirmDisable = Potvrdi onemogućavanje
configure-moderationPhases-confirmEnable = Potvrdi omogućavanje
configure-moderationPhases-confirmDelete = Potvrdi brisanje

### Webhooks

configure-webhooks-generatedAt = KLJUČ GENERIRAN NA:
configure-webhooks-experimentalFeature = Eksperimentalna značajka
configure-webhooks-webhookEndpointNotFound = Webhook krajnja točka nije pronađena
configure-webhooks-header-title = Konfiguriraj webhook krajnju točku
configure-webhooks-description = Opis
configure-webhooks-addEndpoint = Dodaj webhook krajnju točku
configure-webhooks-addEndpointButton = Dodaj webhook krajnju točku
configure-webhooks-endpoints = Krajnje točke
configure-webhooks-url = URL
configure-webhooks-status = Status
configure-webhooks-noEndpoints = Nema konfiguriranih webhook krajnjih točaka, dodajte jednu iznad.
configure-webhooks-enabledWebhookEndpoint = Omogućena webhook krajnja točka
configure-webhooks-disabledWebhookEndpoint = Onemogućena webhook krajnja točka
configure-webhooks-endpointURL = URL krajnje točke
configure-webhooks-cancelButton = Otkaži
configure-webhooks-updateWebhookEndpointButton = Ažuriraj webhook krajnju točku
configure-webhooks-eventsToSend = Događaji za slanje
configure-webhooks-clearEventsToSend = Očisti
configure-webhooks-eventsToSendDescription = Opis događaja za slanje
configure-webhooks-allEvents = Svi događaji
configure-webhooks-selectedEvents = Odabrani događaji
configure-webhooks-selectAnEvent = Odaberite događaj
configure-webhooks-configureWebhookEndpoint = Konfiguriraj webhook krajnju točku
configure-webhooks-confirmEnable = Potvrdi omogućavanje
configure-webhooks-confirmDisable = Potvrdi onemogućavanje
configure-webhooks-confirmDelete = Potvrdi brisanje
configure-webhooks-dangerZone = Opasna zona
configure-webhooks-rotateSigningSecret = Rotiraj tajni potpis
configure-webhooks-rotateSigningSecretDescription = Opis rotacije tajnog potpisa
configure-webhooks-rotateSigningSecretButton = Rotiraj tajni potpis
configure-webhooks-rotateSigningSecretHelper = Pomoć za rotaciju tajnog potpisa
configure-webhooks-rotateSigningSecretSuccessUseNewSecret = Uspješna rotacija, koristite novi tajni potpis
configure-webhooks-disableEndpoint = Onemogući krajnju točku
configure-webhooks-disableEndpointDescription = Opis onemogućavanja krajnje točke
configure-webhooks-disableEndpointButton = Onemogući krajnju točku
configure-webhooks-enableEndpoint = Omogući krajnju točku
configure-webhooks-enableEndpointDescription = Opis omogućavanja krajnje točke
configure-webhooks-enableEndpointButton = Omogući krajnju točku
configure-webhooks-deleteEndpoint = Izbriši krajnju točku
configure-webhooks-deleteEndpointDescription = Opis brisanja krajnje točke
configure-webhooks-deleteEndpointButton = Izbriši krajnju točku
configure-webhooks-endpointStatus = Status krajnje točke
configure-webhooks-signingSecret = Tajni potpis
configure-webhooks-signingSecretDescription = Opis tajnog potpisa
configure-webhooks-expiresOldSecret = Istek starog tajnog potpisa
configure-webhooks-expiresOldSecretImmediately = Odmah
configure-webhooks-expiresOldSecretHoursFromNow = Istek starog tajnog potpisa za nekoliko sati
configure-webhooks-detailsButton = Detalji <icon></icon>

### General
configure-general-guidelines-title = Sažetak smjernica zajednice
configure-general-guidelines-explanation = Objašnjenje
configure-general-guidelines-showCommunityGuidelines = Prikaži sažetak smjernica zajednice

#### Bio
configure-general-memberBio-title = Biografije komentatora
configure-general-memberBio-explanation = Objašnjenje
configure-general-memberBio-label = Dozvoli biografije komentatora

#### Locale
configure-general-locale-language = Jezik
configure-general-locale-chooseLanguage = Odaberite jezik za svoju Coral zajednicu.
configure-general-locale-invalidLanguage = Nevažeći jezik

#### Sitewide Commenting
configure-general-sitewideCommenting-title = Komentiranje na cijeloj stranici
configure-general-sitewideCommenting-explanation = Postavite komentare na cijeloj stranici da se zatvore nakon određenog vremenskog razdoblja od objave priče
configure-general-sitewideCommenting-enableNewCommentsSitewide = Omogući nove komentare na cijeloj stranici
configure-general-sitewideCommenting-onCommentStreamsOpened = Kada su komentari otvoreni
configure-general-sitewideCommenting-offCommentStreamsClosed = Kada su komentari zatvoreni
configure-general-sitewideCommenting-message = Poruka za zatvorene komentare na cijeloj stranici
configure-general-sitewideCommenting-messageExplanation = Objašnjenje poruke za zatvorene komentare na cijeloj stranici

#### Embed Links
configure-general-embedLinks-title = Ugrađeni mediji
configure-general-embedLinks-desc = Opis
configure-general-embedLinks-description = Opis
configure-general-embedLinks-description-addASinglePiece = Dodajte jedan komad
configure-general-embedLinks-enableTwitterEmbeds = Dozvoli ugrađivanje X postova
configure-general-embedLinks-enableBlueskyEmbeds = Dozvoli ugrađivanje Bluesky postova
configure-general-embedLinks-enableYouTubeEmbeds = Dozvoli ugrađivanje YouTube videa
configure-general-embedLinks-enableGifs = Dozvoli GIF-ove
configure-general-embedLinks-enableExternalEmbeds = Omogući vanjske medije

configure-general-embedLinks-On = Da
configure-general-embedLinks-Off = Ne

configure-general-embedLinks-giphyMaxRating = Ocjena sadržaja GIF-ova
configure-general-embedLinks-giphyMaxRating-desc = Odaberite maksimalnu ocjenu sadržaja za GIF-ove koji će se pojaviti u rezultatima pretraživanja komentatora

configure-general-embedLinks-giphyMaxRating-g = G
configure-general-embedLinks-giphyMaxRating-g-desc = Sadržaj prikladan za sve uzraste
configure-general-embedLinks-giphyMaxRating-pg = PG
configure-general-embedLinks-giphyMaxRating-pg-desc = Sadržaj koji je općenito siguran za sve, ali se preporučuje roditeljski nadzor za djecu.
configure-general-embedLinks-giphyMaxRating-pg13 = PG-13
configure-general-embedLinks-giphyMaxRating-pg13-desc = Blage seksualne aluzije, blaga upotreba supstanci, blaga psovka ili prijeteće slike. Može uključivati slike polu-golih ljudi, ali NE prikazuje stvarne ljudske genitalije ili golotinju.
configure-general-embedLinks-giphyMaxRating-r = R
configure-general-embedLinks-giphyMaxRating-r-desc = Snažan jezik, snažne seksualne aluzije, nasilje i upotreba ilegalnih droga; nije prikladno za tinejdžere ili mlađe. Nema golotinje.

configure-general-embedLinks-configuration = Konfiguracija

configure-general-embedLinks-gifProvider = Pružatelj GIF-ova
configure-general-embedLinks-gifProvider-desc = Opis

configure-general-embedLinks-gifs-provider-Giphy = Giphy
configure-general-embedLinks-gifs-provider-Tenor = Tenor

configure-general-embedLinks-configuration-desc = Opis konfiguracije
configure-general-embedLinks-configuration-giphy-desc = Opis konfiguracije Giphy
configure-general-embedLinks-giphyAPIKey = GIPHY API ključ

configure-general-embedLinks-configuration-tenor-desc = Opis konfiguracije Tenor
configure-general-embedLinks-tenorAPIKey = TENOR API ključ

#### Configure Announcements

configure-general-announcements-title = Najava zajednice
configure-general-announcements-description = Opis
configure-general-announcements-delete = Ukloni najavu
configure-general-announcements-add = Dodaj najavu
configure-general-announcements-start = Započni najavu
configure-general-announcements-cancel = Otkaži
configure-general-announcements-current-label = Trenutna najava
configure-general-announcements-current-duration = Trajanje trenutne najave
configure-general-announcements-duration = Prikaži ovu najavu za

#### Closing Comment Streams
configure-general-closingCommentStreams-title = Zatvaranje tokova komentara
configure-general-closingCommentStreams-explanation = Postavite tokove komentara da se zatvore nakon definiranog vremenskog razdoblja od objave priče
configure-general-closingCommentStreams-closeCommentsAutomatically = Automatski zatvori komentare
configure-general-closingCommentStreams-closeCommentsAfter = Zatvori komentare nakon

#### Comment Length
configure-general-commentLength-title = Duljina komentara
configure-general-commentLength-maxCommentLength = Maksimalna duljina komentara
configure-general-commentLength-setLimit = Postavi ograničenje
configure-general-commentLength-limitCommentLength = Ograniči duljinu komentara
configure-general-commentLength-minCommentLength = Minimalna duljina komentara
configure-general-commentLength-characters = Znakovi
configure-general-commentLength-textField = Tekstualno polje
configure-general-commentLength-validateLongerThanMin = Provjeri duljinu veću od minimalne

#### Comment Editing
configure-general-commentEditing-title = Uređivanje komentara
configure-general-commentEditing-explanation = Objašnjenje
configure-general-commentEditing-commentEditTimeFrame = Vremenski okvir za uređivanje komentara
configure-general-commentEditing-seconds = Sekunde

#### Flatten replies
configure-general-flattenReplies-title = Izravnaj odgovore
configure-general-flattenReplies-enabled = Izravnani odgovori omogućeni
configure-general-flattenReplies-explanation = Objašnjenje

configure-general-featuredBy-title = Istaknuto od
configure-general-featuredBy-enabled = Istaknuto omogućeno
configure-general-featuredBy-explanation = Dodajte ime moderatora na prikaz istaknutog komentara

configure-general-topCommenter-title = Značka najboljeg komentatora
configure-general-topCommenter-explanation = Dodajte značku najboljeg komentatora komentatorima s istaknutim komentarima u posljednjih 10 dana
configure-general-topCommenter-enabled = Omogući značke najboljih komentatora

configure-general-flairBadge-header = Prilagođene značke
configure-general-flairBadge-description = Potičite angažman korisnika i sudjelovanje dodavanjem prilagođenih znački
configure-general-flairBadge-enable-label = Omogući prilagođene značke
configure-general-flairBadge-add = URL značke
configure-general-flairBadge-add-helperText = Pomoćni tekst za dodavanje značke
configure-general-flairBadge-url-error = Pogreška URL-a
configure-general-flairBadge-add-name = Ime značke
configure-general-flairBadge-add-name-helperText = Pomoćni tekst za dodavanje imena značke
configure-general-flairBadge-name-permittedCharacters = Dozvoljeni znakovi
configure-general-flairBadge-add-button = Dodaj
configure-general-flairBadge-table-flairName = Ime
configure-general-flairBadge-table-flairURL = URL
configure-general-flairBadge-table-preview = Pregled
configure-general-flairBadge-table-deleteButton = <icon></icon> Izbriši
configure-general-flairBadge-table-empty = Nema prilagođenih znački za ovu stranicu

#### Obavijesti na stranici
configure-general-inPageNotifications-title = Obavijesti na stranici
configure-general-inPageNotifications-explanation = Dodajte obavijesti u Coral. Kada je omogućeno, komentatori mogu primati obavijesti kada prime sve odgovore, odgovore samo od članova vašeg tima, kada se objavi komentar na čekanju. Komentatori mogu onemogućiti vizualne indikatore obavijesti u svojim postavkama profila. Ovo će ukloniti e-mail obavijesti.
configure-general-inPageNotifications-enabled = Obavijesti na stranici omogućene
configure-general-inPageNotifications-floatingBellIndicator = Plutajući indikator zvona

#### Poruka zatvorenog toka
configure-general-closedStreamMessage-title = Poruka zatvorenog toka komentara
configure-general-closedStreamMessage-explanation = Napišite poruku koja će se pojaviti kada je priča zatvorena za komentiranje.

### Organizacija
configure-organization-name = Naziv organizacije
configure-organization-sites = Stranice
configure-organization-nameExplanation =
  Naziv vaše organizacije pojavit će se u e-mailovima koje { -product-name } šalje vašoj zajednici i članovima organizacije.
configure-organization-sites-explanation =
  Dodajte novu stranicu svojoj organizaciji ili uredite detalje postojeće stranice.
configure-organization-sites-add-site = <icon></icon> Dodaj stranicu
configure-organization-email = E-mail organizacije
configure-organization-emailExplanation =
  Ova e-mail adresa će se koristiti u e-mailovima i na platformi
  kako bi se članovi zajednice mogli obratiti organizaciji ako
  imaju pitanja o statusu svojih računa ili pitanja o moderiranju.
configure-organization-url = URL organizacije
configure-organization-urlExplanation =
  URL vaše organizacije pojavit će se u e-mailovima koje { -product-name } šalje vašoj zajednici i članovima organizacije.

### Stranice
configure-sites-site-details = Detalji <icon></icon>
configure-sites-add-new-site = Dodajte novu stranicu na { $site }
configure-sites-add-success = { $site } je dodana u { $org }
configure-sites-edit-success = Promjene na { $site } su spremljene.
configure-sites-site-form-name = Naziv stranice
configure-sites-site-form-name-explanation = Naziv stranice pojavit će se u e-mailovima koje Coral šalje vašoj zajednici i članovima organizacije.
configure-sites-site-form-url = URL stranice
configure-sites-site-form-url-explanation = Ovaj URL će se pojaviti u e-mailovima koje Coral šalje članovima vaše zajednice.
configure-sites-site-form-email = E-mail adresa stranice
configure-sites-site-form-url-explanation = Ova e-mail adresa je za članove zajednice da vas kontaktiraju s pitanjima ili ako trebaju pomoć. npr. comments@yoursite.com
configure-sites-site-form-domains = Dozvoljeni domeni stranice
configure-sites-site-form-domains-explanation = Domeni na kojima je dozvoljeno ugraditi Coral tokove komentara (npr. http://localhost:3000, https://staging.domain.com, https://domain.com).
configure-sites-site-form-submit = <icon></icon> Dodaj stranicu
configure-sites-site-form-cancel = Otkaži
configure-sites-site-form-save = Spremi promjene
configure-sites-site-edit = Uredi detalje { $site }
configure-sites-site-form-embed-code = Ugradbeni kod
sites-emptyMessage = Nismo pronašli nijednu stranicu koja odgovara vašim kriterijima.
sites-selector-allSites = Sve stranice
site-filter-option-allSites = Sve stranice

site-selector-all-sites = Sve stranice
stories-filter-sites-allSites = Sve stranice
stories-filter-statuses = Status
stories-column-site = Stranica
site-table-siteName = Naziv stranice
stories-filter-sites = Stranica

site-search-searchButton =
  [...]
site-search-textField =
  [...]
site-search-textField =
  [...]
site-search-none-found = Nije pronađena nijedna stranica s tim pretraživanjem
specificSitesSelect-validation = Morate odabrati barem jednu stranicu.

stories-column-actions = Radnje
stories-column-rescrape = Ponovno preuzimanje

stories-openInfoDrawer =
  [...]
stories-actions-popover =
  [...]
stories-actions-rescrape = Ponovno preuzimanje
stories-actions-close = Zatvori priču
stories-actions-open = Otvori priču
stories-actions-archive = Arhiviraj priču
stories-actions-unarchive = De-arhiviraj priču
stories-actions-isUnarchiving = De-arhiviranje

### Sekcije

moderate-section-selector-allSections = Sve sekcije
moderate-section-selector-uncategorized = Nekategorizirano
moderate-section-uncategorized = Nekategorizirano

### E-mail

configure-email = Postavke e-maila
configure-email-configBoxEnabled = Omogućeno
configure-email-fromNameLabel = Ime pošiljatelja
configure-email-fromNameDescription =
  [...]
configure-email-fromEmailLabel = E-mail adresa pošiljatelja
configure-email-fromEmailDescription =
  [...]
configure-email-smtpHostLabel = SMTP host
configure-email-smtpHostDescription = (npr. smtp.sendgrid.net)
configure-email-smtpPortLabel = SMTP port
configure-email-smtpPortDescription = (npr. 25)
configure-email-smtpTLSLabel = TLS
configure-email-smtpAuthenticationLabel = SMTP autentifikacija
configure-email-smtpCredentialsHeader = E-mail vjerodajnice
configure-email-smtpUsernameLabel = Korisničko ime
configure-email-smtpPasswordLabel = Lozinka
configure-email-send-test = Pošalji testni e-mail

### Autentifikacija

configure-auth-clientID = ID klijenta
configure-auth-clientSecret = Tajna klijenta
configure-auth-configBoxEnabled = Omogućeno
configure-auth-targetFilterCoralAdmin = { -product-name } Admin
configure-auth-targetFilterCommentStream = Tok komentara
configure-auth-redirectURI = URI preusmjeravanja
configure-auth-registration = Registracija
configure-auth-registrationDescription =
  [...]
configure-auth-registrationCheckBox = Dozvoli registraciju
configure-auth-pleaseEnableAuthForAdmin =
  [...]
configure-auth-confirmNoAuthForCommentStream =
  [...]

configure-auth-facebook-loginWith = Prijava s Facebookom
configure-auth-facebook-toEnableIntegration =
  [...]
configure-auth-facebook-useLoginOn = Koristi prijavu s Facebookom na

configure-auth-google-loginWith = Prijava s Googleom
configure-auth-google-toEnableIntegration =
  [...]
configure-auth-google-useLoginOn = Koristi prijavu s Googleom na

configure-auth-sso-loginWith = Prijava s jedinstvenom prijavom (SSO)
configure-auth-sso-useLoginOn = Koristi prijavu s jedinstvenom prijavom na
configure-auth-sso-key = Ključ
configure-auth-sso-regenerate = Regeneriraj
configure-auth-sso-regenerateAt = KLJUČ GENERIRAN NA:
  [...]
configure-auth-sso-regenerateHonoredWarning =
  [...]

configure-auth-sso-description =
  [...]

configure-auth-sso-rotate-keys = Ključevi
configure-auth-sso-rotate-keyID = ID ključa
configure-auth-sso-rotate-secret = Tajna
configure-auth-sso-rotate-copySecret =
  [...]

configure-auth-sso-rotate-date =
  [...]
configure-auth-sso-rotate-activeSince = Aktivno od
configure-auth-sso-rotate-inactiveAt = Neaktivno od
configure-auth-sso-rotate-inactiveSince = Neaktivno od

configure-auth-sso-rotate-status = Status
configure-auth-sso-rotate-statusActive = Aktivno
configure-auth-sso-rotate-statusExpiring = Istječe
configure-auth-sso-rotate-statusExpired = Isteklo
configure-auth-sso-rotate-statusUnknown = Nepoznat status

configure-auth-sso-rotate-expiringTooltip =
  [...]
configure-auth-sso-rotate-expiringTooltip-toggleButton =
  [...]
configure-auth-sso-rotate-expiredTooltip =
  [...]
configure-auth-sso-rotate-expiredTooltip-toggleButton =
  [...]

configure-auth-sso-rotate-rotate = Rotiraj
configure-auth-sso-rotate-deactivateNow = Deaktiviraj sada
configure-auth-sso-rotate-delete = Izbriši

configure-auth-sso-rotate-now = Sada
configure-auth-sso-rotate-10seconds = 10 sekundi od sada
configure-auth-sso-rotate-1day = 1 dan od sada
configure-auth-sso-rotate-1week = 1 tjedan od sada
configure-auth-sso-rotate-30days = 30 dana od sada
configure-auth-sso-rotate-dropdown-description =
  [...]

configure-auth-local-loginWith = Prijava s e-mail autentifikacijom
configure-auth-local-useLoginOn = Koristi prijavu s e-mail autentifikacijom na
configure-auth-local-forceAdminLocalAuth =
  [...]

configure-auth-oidc-loginWith = Prijava s OpenID Connect
configure-auth-oidc-toLearnMore = Saznajte više: <Link></Link>
configure-auth-oidc-providerName = Naziv pružatelja
configure-auth-oidc-providerNameDescription =
  [...]
configure-auth-oidc-issuer = Izdavač
configure-auth-oidc-issuerDescription =
  [...]
configure-auth-oidc-authorizationURL = URL autorizacije
configure-auth-oidc-tokenURL = URL tokena
configure-auth-oidc-jwksURI = JWKS URI
configure-auth-oidc-useLoginOn = Koristi prijavu s OpenID Connect na

configure-auth-settings = Postavke sesije
configure-auth-settings-session-duration-label = Trajanje sesije

### Moderiranje

### Nedavna povijest komentara

configure-moderation-recentCommentHistory-title = Nedavna povijest
configure-moderation-recentCommentHistory-timeFrame = Vremensko razdoblje nedavne povijesti komentara
configure-moderation-recentCommentHistory-timeFrame-description =
  [...]
configure-moderation-recentCommentHistory-enabled = Filter nedavne povijesti
configure-moderation-recentCommentHistory-enabled-description =
  [...]
configure-moderation-recentCommentHistory-triggerRejectionRate = Prag stope odbijanja
configure-moderation-recentCommentHistory-triggerRejectionRate-description =
  [...]

#### Vanjske poveznice za moderatore
configure-moderation-externalLinks-title = Vanjske poveznice za moderatore
configure-moderation-externalLinks-profile-explanation = Kada je uključen URL format
  [...]
configure-moderation-externalLinks-profile-label = Vanjski profil URL uzorak
configure-moderation-externalLinks-profile-input =
  [...]

#### Pre-moderacija
configure-moderation-preModeration-title = Pre-moderacija
configure-moderation-preModeration-explanation =
  [...]
configure-moderation-preModeration-moderation =
  [...]
configure-moderation-preModeration-premodLinksEnable =
  [...]

#### Opcije moderiranja za sve/specifične stranice
configure-moderation-specificSites = Specifične stranice
configure-moderation-allSites = Sve stranice

configure-moderation-apiKey = API ključ

configure-moderation-akismet-title = Filter za otkrivanje spama
configure-moderation-akismet-explanation =
  [...]

configure-moderation-premModeration-premodSuspectWordsEnable =
  [...]
configure-moderation-premModeration-premodSuspectWordsDescription =
  [...]

#### Akismet
configure-moderation-akismet-filter = Filter za otkrivanje spama
configure-moderation-akismet-ipBased = Otkrivanje spama na temelju IP-a
configure-moderation-akismet-accountNote =
  [...]
configure-moderation-akismet-siteURL = URL stranice


#### Perspektiva
configure-moderation-perspective-title = Filter za toksične komentare
configure-moderation-perspective-explanation =
  [...]
configure-moderation-perspective-filter = Filter za toksične komentare
configure-moderation-perspective-toxicityThreshold = Prag toksičnosti
configure-moderation-perspective-toxicityThresholdDescription =
  [...]
configure-moderation-perspective-toxicityModel = Model toksičnosti
configure-moderation-perspective-toxicityModelDescription =
  [...]
configure-moderation-perspective-allowStoreCommentData = Dozvoli Googleu pohranu podataka o komentarima
configure-moderation-perspective-allowStoreCommentDataDescription =
  [...]
configure-moderation-perspective-allowSendFeedback =
  [...]
configure-moderation-perspective-allowSendFeedbackDescription =
  [...]
configure-moderation-perspective-customEndpoint = Prilagođeno krajnje odredište
configure-moderation-perspective-defaultEndpoint =
  [...]
configure-moderation-perspective-accountNote =
  [...]

configure-moderation-newCommenters-title = Odobravanje novih komentatora
configure-moderation-newCommenters-enable = Omogući odobravanje novih komentatora
configure-moderation-newCommenters-description =
  [...]
configure-moderation-newCommenters-enable-description = Omogući pre-moderaciju za nove komentatore
configure-moderation-newCommenters-approvedCommentsThreshold = Broj komentara koji moraju biti odobreni
configure-moderation-newCommenters-approvedCommentsThreshold-description =
  [...]
configure-moderation-newCommenters-comments = komentari

#### Nemoderirani brojevi
configure-moderation-unmoderatedCounts-title = Nemoderirani brojevi
configure-moderation-unmoderatedCounts-enabled = Prikaži broj nemoderiranih komentara u redu

#### E-mail domena
configure-moderation-emailDomains-header = E-mail domena
configure-moderation-emailDomains-description = Kreirajte pravila za poduzimanje radnji na računima ili komentarima na temelju domene e-mail adrese vlasnika računa.
configure-moderation-emailDomains-add = Dodaj e-mail domenu
configure-moderation-emailDomains-edit = Uredi e-mail domenu
configure-moderation-emailDomains-addDomain = <icon></icon> Dodaj domenu
configure-moderation-emailDomains-table-domain = Domena
configure-moderation-emailDomains-table-action = Radnja
configure-moderation-emailDomains-table-edit = <icon></icon> Uredi
configure-moderation-emailDomains-table-delete = <icon></icon> Izbriši
configure-moderation-emailDomains-form-label-domain = Domena
configure-moderation-emailDomains-form-label-moderationAction = Radnja moderiranja
configure-moderation-emailDomains-banAllUsers = Zabrani sve nove račune komentatora
configure-moderation-emailDomains-alwaysPremod = Uvijek pre-moderiraj komentare
configure-moderation-emailDomains-form-cancel = Otkaži
configure-moderation-emailDomains-form-addDomain = Dodaj domenu
configure-moderation-emailDomains-form-editDomain = Ažuriraj
configure-moderation-emailDomains-confirmDelete = Brisanje ove e-mail domene će zaustaviti bilo koji novi račun kreiran s njom od zabrane ili uvijek pre-moderiranja. Jeste li sigurni da želite nastaviti?
configure-moderation-emailDomains-form-description-add = Dodajte domenu i odaberite radnju koja bi trebala biti poduzeta na svakom novom računu kreiranom pomoću navedene domene.
configure-moderation-emailDomains-form-description-edit = Ažurirajte domenu ili radnju koja bi trebala biti poduzeta na svakom novom računu pomoću navedene domene.
configure-moderation-emailDomains-exceptions-header = Iznimke
configure-moderation-emailDomains-exceptions-helperText = Ove domene ne mogu biti zabranjene. Domene bi trebale biti napisane bez www, na primjer "gmail.com". Odvojite domene zarezom i razmakom.

configure-moderation-emailDomains-showCurrent = Prikaži trenutni popis domena
configure-moderation-emailDomains-hideCurrent = Sakrij trenutni popis domena
configure-moderation-emailDomains-filterByStatus =
  [...]
configuration-moderation-emailDomains-empty = Nema konfiguriranih e-mail domena.

configure-moderation-emailDomains-allDomains = Sve domene
configure-moderation-emailDomains-preMod = Pre-mod
configure-moderation-emailDomains-banned = Zabranjeno

#### Pre-moderiraj konfiguraciju e-mail adrese

configure-moderation-premoderateEmailAddress-title = E-mail adresa
configure-moderation-premoderateEmailAddress-enabled =
  [...]
configure-moderation-premoderateEmailAddress-enabled-description =
  [...]
  korelacija. Može biti korisno proaktivno pre-moderirati ih.

#### Konfiguracija zabranjenih riječi
configure-wordList-banned-bannedWordsAndPhrases = Zabranjene riječi i fraze
configure-wordList-banned-explanation =
  Komentari koji sadrže riječ ili frazu na popisu zabranjenih riječi su <strong>automatski odbijeni i nisu objavljeni</strong>.
configure-wordList-banned-wordList = Popis zabranjenih riječi
configure-wordList-banned-wordListDetailInstructions =
  Odvojite zabranjene riječi ili fraze novim redom. Riječi/fraze nisu osjetljive na velika i mala slova.

#### Konfiguracija sumnjivih riječi
configure-wordList-suspect-bannedWordsAndPhrases = Sumnjive riječi i fraze
configure-wordList-suspect-explanation =
  Komentari koji sadrže riječ ili frazu na popisu sumnjivih riječi
  su <strong>smješteni u red za pregled moderatora i su
  objavljeni (ako komentari nisu pre-moderirani).</strong>
configure-wordList-suspect-explanationSuspectWordsList =
  Komentari koji sadrže riječ ili frazu na popisu sumnjivih riječi su
  <strong>smješteni u red za čekanje za pregled moderatora i nisu
  objavljeni osim ako ih moderator ne odobri.</strong>
configure-wordList-suspect-wordList = Popis sumnjivih riječi
configure-wordList-suspect-wordListDetailInstructions =
  Odvojite sumnjive riječi ili fraze novim redom. Riječi/fraze nisu osjetljive na velika i mala slova.

### Napredno
configure-advanced-customCSS = Prilagođeni CSS
configure-advanced-customCSS-override =
  URL CSS stilskog lista koji će nadjačati zadane stilove ugrađenog toka.
configure-advanced-customCSS-stylesheetURL = URL prilagođenog CSS stilskog lista
configure-advanced-customCSS-fontsStylesheetURL = URL prilagođenog CSS stilskog lista za fontove
configure-advanced-customCSS-containsFontFace =
  URL prilagođenog CSS stilskog lista koji sadrži sve @font-face
  definicije potrebne za gornji stilski list.

configure-advanced-embeddedComments = Ugrađeni komentari
configure-advanced-embeddedComments-subheader = Za stranice koje koriste oEmbed
configure-advanced-embeddedCommentReplies-explanation = Kada je omogućeno, gumb za odgovor
  će se pojaviti uz svaki ugrađeni komentar kako bi se potaknula dodatna rasprava o tom
  specifičnom komentaru ili priči.
configure-advanced-embeddedCommentReplies-label = Dopusti odgovore na ugrađene komentare

configure-advanced-oembedAllowedOrigins-header = Dozvoljene domene za oEmbed
configure-advanced-oembedAllowedOrigins-description = Domene koje su dozvoljene za pozive na oEmbed API (npr. http://localhost:3000, https://staging.domain.com, https://domain.com).
configure-advanced-oembedAllowedOrigins-label = Dozvoljene domene za oEmbed

configure-advanced-permittedDomains = Dozvoljene domene
configure-advanced-permittedDomains-description =
  Domene na kojima je vaša { -product-name } instanca dozvoljena za ugradnju
  uključujući shemu (npr. http://localhost:3000, https://staging.domain.com,
  https://domain.com).

configure-advanced-liveUpdates = Ažuriranja komentara u stvarnom vremenu
configure-advanced-liveUpdates-explanation =
  Kada je omogućeno, komentari će se učitavati i ažurirati u stvarnom vremenu.
  Kada je onemogućeno, korisnici će morati osvježiti stranicu kako bi vidjeli nove komentare.

configure-advanced-embedCode-title = Ugradbeni kod
configure-advanced-embedCode-explanation =
  Kopirajte i zalijepite kod ispod u svoj CMS kako biste ugradili Coral tok komentara u
  svaku priču na vašoj stranici.

configure-advanced-embedCode-comment =
  Uklonite komentare s ovih linija i zamijenite s ID-om
  priče i URL-om iz vašeg CMS-a kako biste omogućili
  najtjesniju integraciju. Pogledajte našu dokumentaciju na
  https://docs.coralproject.net za sve opcije konfiguracije.

configure-advanced-amp = Ubrzane mobilne stranice
configure-advanced-amp-explanation =
  Omogućite podršku za <LinkToAMP>AMP</LinkToAMP> na toku komentara.
  Kada je omogućeno, morat ćete dodati Coralov AMP ugradbeni kod u predložak stranice.
  Pogledajte našu <LinkToDocs>dokumentaciju</LinkToDocs> za više
  detalja. Omogući podršku.

configure-advanced-for-review-queue = Pregled svih korisničkih prijava
configure-advanced-for-review-queue-explanation =
  Kada je komentar odobren, neće se ponovno pojaviti u redu prijavljenih
  čak i ako ga dodatni korisnici prijave. Ova značajka dodaje red "Za pregled",
  omogućujući moderatorima da vide sve korisničke prijave u sustavu i ručno
  označe kao "Pregledano".
configure-advanced-for-review-queue-label = Prikaži red "Za pregled"

## Povijest odluka
decisionHistory-popover =
  .description = Dijalog koji prikazuje povijest odluka
decisionHistory-youWillSeeAList =
  Vidjet ćete popis svojih post-moderacijskih radnji ovdje.
decisionHistory-showMoreButton =
  Prikaži više
decisionHistory-yourDecisionHistory = Vaša povijest odluka
decisionHistory-rejectedCommentBy = Odbijen komentar od <Username></Username>
decisionHistory-approvedCommentBy = Odobren komentar od <Username></Username>
decisionHistory-goToComment = Idi na komentar

### Slack

configure-slack-header-title = Slack integracije
configure-slack-description =
  Automatski šaljite komentare iz Coral moderacijskih redova u Slack
  kanale. Trebat će vam administratorski pristup Slacku za postavljanje. Za
  korake kako stvoriti Slack aplikaciju pogledajte našu <externalLink>dokumentaciju</externalLink>.
configure-slack-notRecommended =
  Nije preporučeno za stranice s više od 10K komentara mjesečno.
configure-slack-addChannel = Dodaj kanal

configure-slack-channel-defaultName = Novi kanal
configure-slack-channel-enabled = Omogućeno
configure-slack-channel-remove = Ukloni kanal
configure-slack-channel-name-label = Naziv
configure-slack-channel-name-description =
  Ovo je samo za vašu informaciju, kako biste lakše identificirali
  svaku Slack vezu. Slack nam ne daje naziv
  kanala na koji se povezujete s Coralom.
configure-slack-channel-hookURL-label = Webhook URL
configure-slack-channel-hookURL-description =
  Slack pruža URL specifičan za kanal za aktiviranje webhook
  veza. Da biste pronašli URL za jedan od svojih Slack kanala,
  slijedite upute <externalLink>ovdje</externalLink>.
configure-slack-channel-triggers-label =
  Primajte obavijesti u ovom Slack kanalu za
configure-slack-channel-triggers-reportedComments = Prijavljeni komentari
configure-slack-channel-triggers-pendingComments = Komentari na čekanju
configure-slack-channel-triggers-featuredComments = Istaknuti komentari
configure-slack-channel-triggers-allComments = Svi komentari
configure-slack-channel-triggers-staffComments = Komentari osoblja

## moderiranje
moderate-navigation-reported = prijavljeno
moderate-navigation-pending = Na čekanju
moderate-navigation-unmoderated = nemoderirano
moderate-navigation-rejected = odbijeno
moderate-navigation-approved = odobreno
moderate-navigation-comment-count = { SHORT_NUMBER($count) }
moderate-navigation-forReview = za pregled

moderate-marker-preMod = Pre-mod
moderate-marker-link = Poveznica
moderate-marker-bannedWord = Zabranjena riječ
moderate-marker-bio = Biografija
moderate-marker-illegal = Potencijalno nezakonit sadržaj
moderate-marker-possibleBannedWord = Moguća zabranjena riječ
moderate-marker-suspectWord = Sumnjiva riječ
moderate-marker-possibleSuspectWord = Moguća sumnjiva riječ
moderate-marker-spam = Neželjena pošta
moderate-marker-spamDetected = Otkrivena neželjena pošta
moderate-marker-toxic = Toksično
moderate-marker-recentHistory = Nedavna povijest
moderate-marker-bodyCount = Broj tijela
moderate-marker-offensive = Uvredljivo
moderate-marker-abusive = Zlostavljački
moderate-marker-newCommenter = Novi komentator
moderate-marker-repeatPost = Ponovljeni komentar
moderate-marker-other = Drugo
moderate-marker-preMod-userEmail = E-mail korisnika

moderate-markers-details = Detalji
moderate-flagDetails-latestReports = Najnovija izvješća
moderate-flagDetails-offensive = Uvredljivo
moderate-flagDetails-abusive = Zlostavljački
moderate-flagDetails-spam = Neželjena pošta
moderate-flagDetails-bio = Biografija
moderate-flagDetails-other = Drugo
moderate-flagDetails-illegalContent = Potencijalno nezakonit sadržaj
moderate-flagDetails-viewDSAReport = Pogledaj DSA izvješće

moderate-card-flag-details-anonymousUser = Anonimni korisnik

moderate-flagDetails-toxicityScore = Ocjena toksičnosti
moderate-toxicityLabel-likely = Vjerojatno <score></score>
moderate-toxicityLabel-unlikely = Malo vjerojatno <score></score>
moderate-toxicityLabel-maybe = Možda <score></score>

moderate-linkDetails-label = Kopiraj poveznicu na ovaj komentar
moderate-in-stream-link-copy = U toku
moderate-in-moderation-link-copy = U moderaciji

moderate-decisionDetails-decisionLabel = Odluka
moderate-decisionDetails-rejected = Odbijeno
moderate-decisionDetails-reasonLabel = Razlog
moderate-decisionDetails-lawBrokenLabel = Prekršen zakon
moderate-decisionDetails-customReasonLabel = Prilagođeni razlog
moderate-decisionDetails-detailedExplanationLabel = Detaljno objašnjenje

moderate-emptyQueue-pending = Odlično! Nema više komentara na čekanju za moderiranje.
moderate-emptyQueue-reported = Odlično! Nema više prijavljenih komentara za moderiranje.
moderate-emptyQueue-unmoderated = Odlično! Svi komentari su moderirani.
moderate-emptyQueue-rejected = Nema odbijenih komentara.
moderate-emptyQueue-approved = Nema odobrenih komentara.

moderate-comment-edited = (uređeno)
moderate-comment-inReplyTo = Odgovor na <Username></Username>
moderate-comment-viewContext = Pogledaj kontekst
moderate-comment-viewConversation = Pogledaj razgovor
moderate-comment-rejectButton =
  .aria-label = Odbij
moderate-comment-approveButton =
  .aria-label = Odobri
moderate-comment-decision = Odluka
moderate-comment-story = Priča
moderate-comment-storyLabel = Komentar na
moderate-comment-moderateStory = Moderiraj priču
moderate-comment-featureText = Istakni
moderate-comment-featuredText = Istaknuto
moderate-comment-moderatedBy = Moderirao
moderate-comment-moderatedBySystem = Sustav
moderate-comment-play-gif = Pusti GIF
moderate-comment-load-video = Učitaj video

moderate-single-goToModerationQueues = Idi na redove moderacije
moderate-single-singleCommentView = Pregled jednog komentara

moderate-queue-viewNew =
  { $count ->
    [1] Pogledaj {$count} novi komentar
    *[other] Pogledaj {$count} novih komentara
  }

moderate-comment-deleted-body =
  Ovaj komentar više nije dostupan. Komentator je izbrisao svoj račun.

### Traka za pretraživanje moderiranja
moderate-searchBar-allStories = Sve priče
  .title = Sve priče
moderate-searchBar-noStories = Nismo mogli pronaći nijednu priču koja odgovara vašim kriterijima
moderate-searchBar-stories = Priče:
moderate-searchBar-searchButton = Pretraži
moderate-searchBar-titleNotAvailable =
  .title = Naslov nije dostupan
moderate-searchBar-comboBox =
  .aria-label = Pretraži ili skoči na priču
moderate-searchBar-searchForm =
  .aria-label = Priče
moderate-searchBar-currentlyModerating =
  .title = Trenutno moderiranje
moderate-searchBar-searchResults = Rezultati pretraživanja
moderate-searchBar-searchResultsMostRecentFirst = Rezultati pretraživanja (najnoviji prvo)
moderate-searchBar-searchResultsMostRelevantFirst = Rezultati pretraživanja (najrelevantniji prvo)
moderate-searchBar-moderateAllStories = Moderiraj sve priče
moderate-searchBar-comboBoxTextField =
  .aria-label = Pretraži ili skoči na priču...
  .placeholder = pretraži po naslovu priče, autoru, URL-u, ID-u, itd.
moderate-searchBar-goTo = Idi na
moderate-searchBar-seeAllResults = Pogledaj sve rezultate

moderateCardDetails-tab-info = Informacije
moderateCardDetails-tab-decision = Odluka
moderateCardDetails-tab-edits = Povijest uređivanja
moderateCardDetails-tab-automatedActions = Automatske radnje
moderateCardDetails-tab-reactions = Reakcije
moderateCardDetails-tab-reactions-loadMore = Učitaj više
moderateCardDetails-tab-noIssuesFound = Nema pronađenih problema
moderateCardDetails-tab-missingPhase = Nije pokrenuto

moderateCardDetails-tab-externalMod-status = Status
moderateCardDetails-tab-externalMod-flags = Oznake
moderateCardDetails-tab-externalMod-tags = Oznake

moderateCardDetails-tab-externalMod-none = Nijedan
moderateCardDetails-tab-externalMod-approved = Odobreno
moderateCardDetails-tab-externalMod-rejected = Odbijeno
moderateCardDetails-tab-externalMod-premod = Pre-moderirano
moderateCardDetails-tab-externalMod-systemWithheld = Sustav zadržao

### Povijest korisnika u moderiranju

moderate-user-drawer-email =
  .title = E-mail adresa
moderate-user-drawer-created-at =
  .title = Datum kreiranja računa
moderate-user-drawer-member-id =
  .title = ID člana
moderate-user-drawer-external-profile-URL =
  .title = URL vanjskog profila
moderate-user-drawer-external-profile-URL-link = URL vanjskog profila
moderate-user-drawer-tab-all-comments = Svi komentari
moderate-user-drawer-tab-rejected-comments = Odbijeno
moderate-user-drawer-tab-account-history = Povijest računa
moderate-user-drawer-tab-notes = Bilješke
moderate-user-drawer-load-more = Učitaj više
moderate-user-drawer-all-no-comments = {$username} nije poslao nijedan komentar.
moderate-user-drawer-rejected-no-comments = {$username} nema odbijenih komentara.
moderate-user-drawer-user-not-found = Korisnik nije pronađen.
moderate-user-drawer-status-label = Status:
moderate-user-drawer-bio-title = Biografija člana
moderate-user-drawer-username-not-available = Korisničko ime nije dostupno
moderate-user-drawer-username-not-available-tooltip-title = Korisničko ime nije dostupno
moderate-user-drawer-username-not-available-tooltip-body = Korisnik nije dovršio postupak postavljanja računa

moderate-user-drawer-account-history-system = <icon></icon> Sustav
moderate-user-drawer-account-history-suspension-ended = Suspenzija završena
moderate-user-drawer-account-history-suspension-removed = Suspenzija uklonjena
moderate-user-drawer-account-history-banned = Zabranjeno
moderate-user-drawer-account-history-account-domain-banned = Domena računa zabranjena
moderate-user-drawer-account-history-ban-removed = Zabrana uklonjena
moderate-user-drawer-account-history-site-banned = Stranica zabranjena
moderate-user-drawer-account-history-site-ban-removed = Zabrana stranice uklonjena
moderate-user-drawer-account-history-no-history = Nisu poduzete nikakve radnje na ovom računu
moderate-user-drawer-username-change = Promjena korisničkog imena
moderate-user-drawer-username-change-new = Novo:
moderate-user-drawer-username-change-old = Staro:

moderate-user-drawer-account-history-premod-set = Uvijek pre-moderiraj
moderate-user-drawer-account-history-premod-removed = Uklonjeno pre-moderiranje

moderate-user-drawer-account-history-modMessage-sent = Poruka poslana korisniku
moderate-user-drawer-account-history-modMessage-acknowledged = Poruka potvrđena u { $acknowledgedAt }

moderate-user-drawer-newCommenter = Novi komentator

moderate-user-drawer-suspension =
  Suspenzija, { $value } { $unit ->
    [second] { $value ->
      [1] sekunda
      *[other] sekundi
    }
    [minute] { $value ->
      [1] minuta
      *[other] minuta
    }
    [hour] { $value ->
      [1] sat
      *[other] sati
    }
    [day] { $value ->
      [1] dan
      *[other] dana
    }
    [week] { $value ->
      [1] tjedan
      *[other] tjedana
    }
    [month] { $value ->
      [1] mjesec
      *[other] mjeseci
    }
    [year] { $value ->
      [1] godina
      *[other] godina
    }
    *[other] nepoznata jedinica
  }

moderate-user-drawer-deleteAccount-popover =
  .description = Izbornik za brisanje korisničkog računa
moderate-user-drawer-deleteAccount-button =
  .aria-label = Izbriši račun
moderate-user-drawer-deleteAccount-popover-confirm = Upišite "{ $text }" za potvrdu
moderate-user-drawer-deleteAccount-popover-title = Izbriši račun
moderate-user-drawer-deleteAccount-popover-username = Korisničko ime
moderate-user-drawer-deleteAccount-popover-header-description = Brisanje računa će
moderate-user-drawer-deleteAccount-popover-description-list-removeComments = Ukloniti sve komentare koje je ovaj korisnik napisao iz baze podataka.
moderate-user-drawer-deleteAccount-popover-description-list-deleteAll = Izbrisati sve zapise o ovom računu. Korisnik će tada moći stvoriti novi račun koristeći istu e-mail adresu. Ako želite zabraniti ovog korisnika umjesto toga i zadržati njegovu povijest, pritisnite "OTKAŽI" i koristite padajući izbornik Status ispod korisničkog imena.
moderate-user-drawer-deleteAccount-popover-callout = Ovo uklanja sve zapise o ovom korisniku
moderate-user-drawer-deleteAccount-popover-timeframe = Ovo će stupiti na snagu za 24 sata.
moderate-user-drawer-deleteAccount-popover-cancelButton = Otkaži
moderate-user-drawer-deleteAccount-popover-deleteButton = Izbriši

moderate-user-drawer-deleteAccount-scheduled-callout = Brisanje korisnika aktivirano
moderate-user-drawer-deleteAccount-scheduled-timeframe = Ovo će se dogoditi { $deletionDate }.
moderate-user-drawer-deleteAccount-scheduled-cancelDeletion = Otkaži brisanje korisnika

moderate-user-drawer-user-scheduled-deletion = Korisnik zakazan za brisanje
moderate-user-drawer-user-deletion-canceled = Zahtjev za brisanje korisnika otkazan

moderate-user-drawer-account-history-deletion-scheduled = Brisanje zakazano za { $createdAt }
moderate-user-drawer-account-history-canceled-at = Otkazano u { $createdAt }
moderate-user-drawer-account-history-updated-at = Ažurirano u { $createdAt }

moderate-user-drawer-recent-history-title = Nedavna povijest komentara
moderate-user-drawer-recent-history-calculated =
  Izračunato tijekom posljednjih { framework-timeago-time }
moderate-user-drawer-recent-history-rejected = Odbijeno
moderate-user-drawer-recent-history-tooltip-title = Kako je ovo izračunato?
moderate-user-drawer-recent-history-tooltip-body =
  Odbijeni komentari ÷ (odbijeni komentari + objavljeni komentari).
  Prag mogu promijeniti administratori u Konfiguracija > Moderacija.
moderate-user-drawer-recent-history-tooltip-button =
  .aria-label = Prebaci tooltip nedavne povijesti komentara
moderate-user-drawer-recent-history-tooltip-submitted = Poslano

moderate-user-drawer-notes-field =
  .placeholder = Ostavite bilješku...
moderate-user-drawer-notes-button = Dodaj bilješku
moderatorNote-left-by = Ostavio
moderatorNote-delete = Izbriši

moderate-user-drawer-all-comments-archiveThreshold-allOfThisUsers =
  Svi komentari ovog korisnika iz prethodnih { $value } { $unit ->
    [second] { $value ->
      [1] sekunda
      *[other] sekundi
    }
    [minute] { $value ->
      [1] minuta
      *[other] minuta
    }
    [hour] { $value ->
      [1] sat
      *[other] sati
    }
    [day] { $value ->
      [1] dan
      *[other] dana
    }
    [week] { $value ->
      [1] tjedan
      *[other] tjedana
    }
    [month] { $value ->
      [1] mjesec
      *[other] mjeseci
    }
    [year] { $value ->
      [1] godina
      *[other] godina
    }
    *[other] nepoznata jedinica
  }.

# Za Red čekanja za pregled

moderate-forReview-reviewedButton =
  .aria-label = Pregledano
moderate-forReview-markAsReviewedButton =
  .aria-label = Označi kao pregledano
moderate-forReview-time = Vrijeme
moderate-forReview-comment = Komentar
moderate-forReview-reportedBy = Prijavio
moderate-forReview-reason = Razlog
moderate-forReview-description = Opis
moderate-forReview-reviewed = Pregledano

moderate-forReview-detectedBannedWord = Zabranjena riječ
moderate-forReview-detectedLinks = Linkovi
moderate-forReview-detectedNewCommenter = Novi komentator
moderate-forReview-detectedPreModUser = Pre-moderirani korisnik
moderate-forReview-detectedRecentHistory = Nedavna povijest
moderate-forReview-detectedRepeatPost = Ponovljeni post
moderate-forReview-detectedSpam = Spam
moderate-forReview-detectedSuspectWord = Sumnjiva riječ
moderate-forReview-detectedToxic = Toksičan jezik
moderate-forReview-reportedAbusive = Zlostavljački
moderate-forReview-reportedBio = Korisnička biografija
moderate-forReview-reportedOffensive = Uvredljivo
moderate-forReview-reportedOther = Drugo
moderate-forReview-reportedSpam = Spam

# Arhiva

moderate-archived-queue-title = Ova priča je arhivirana
moderate-archived-queue-noModerationActions =
  Nije moguće poduzeti moderacijske radnje na komentarima kada je priča arhivirana.
moderate-archived-queue-toPerformTheseActions =
  Da biste izvršili ove radnje, de-arhivirajte priču.

## Zajednica
community-emptyMessage = Nismo mogli pronaći nikoga u vašoj zajednici koji odgovara vašim kriterijima.

community-filter-searchField =
  .placeholder = Pretraži po korisničkom imenu ili e-mail adresi...
  .aria-label = Pretraži po korisničkom imenu ili e-mail adresi
community-filter-searchButton =
  .aria-label = Pretraži

community-filter-roleSelectField =
  .aria-label = Pretraži po ulozi

community-filter-statusSelectField =
  .aria-label = Pretraži po statusu korisnika

community-changeRoleButton =
  .aria-label = Promijeni ulogu

community-assignMySitesToModerator = Dodijeli moderatora mojim stranicama
community-removeMySitesFromModerator = Ukloni moderatora s mojih stranica
community-assignMySitesToMember = Dodijeli člana mojim stranicama
community-removeMySitesFromMember = Ukloni člana s mojih stranica
community-stillHaveSiteModeratorPrivileges = I dalje će imati privilegije moderatora stranice za:
community-stillHaveMemberPrivileges = I dalje će imati privilegije člana za:
community-userNoLongerPermitted = Korisniku više neće biti dopušteno donositi moderacijske odluke ili dodjeljivati suspenzije na:
community-memberNoLongerPermitted = Korisnik više neće imati privilegije člana na:
community-assignThisUser = Dodijeli ovog korisnika
community-assignYourSitesTo = Dodijeli svoje stranice <strong>{ $username }</strong>
community-siteModeratorsArePermitted = Moderatorima stranica je dopušteno donositi moderacijske odluke i izdavati suspenzije na stranicama kojima su dodijeljeni.
community-membersArePermitted = Članovima je dopušteno primati značku na stranicama kojima su dodijeljeni.
community-removeSiteModeratorPermissions = Ukloni privilegije moderatora stranice
community-removeMemberPermissions = Ukloni privilegije člana

community-filter-optGroupAudience =
  .label = Publika
community-filter-optGroupOrganization =
  .label = Organizacija
community-filter-search = Pretraži
community-filter-showMe = Pokaži mi
community-filter-allRoles = Sve uloge
community-filter-allStatuses = Svi statusi

community-column-username = Korisničko ime
community-column-username-not-available = Korisničko ime nije dostupno
community-column-email-not-available = E-mail nije dostupan
community-column-username-deleted = Izbrisano
community-column-email = E-mail
community-column-memberSince = Član od
community-column-role = Uloga
community-column-status = Status

community-role-popover =
  .description = Padajući izbornik za promjenu korisničke uloge

community-siteRoleActions-popover =
  .description = Padajući izbornik za promaknuće/demaknuće korisnika na/sa stranica

community-userStatus-popover =
  .description = Padajući izbornik za promjenu statusa korisnika

community-userStatus-manageBan = Upravljaj zabranom
community-userStatus-suspendUser = Suspendiraj korisnika
community-userStatus-suspend = Suspendiraj
community-userStatus-suspendEverywhere = Suspendiraj svugdje
community-userStatus-removeSuspension = Ukloni suspenziju
community-userStatus-removeUserSuspension = Ukloni suspenziju korisnika
community-userStatus-unknown = Nepoznat
community-userStatus-changeButton =
  .aria-label = Promijeni status korisnika
community-userStatus-premodUser = Uvijek pre-moderiraj
community-userStatus-removePremod = Ukloni pre-moderiranje

community-banModal-allSites-title = Jeste li sigurni da želite zabraniti <username></username>?
community-banModal-banEmailDomain-title = Zabrana domene e-maila
community-banModal-banEmailDomain = Zabrani sve račune komentatora s { $domain }
community-banModal-banEmailDomain-callOut = Ovo će spriječiti bilo kojeg komentatora da koristi ovu e-mail domenu
community-banModal-banEmailDomain-confirmationText = Upišite "{ $text }" za potvrdu
community-banModal-specificSites-title = Jeste li sigurni da želite upravljati statusom zabrane <username></username>?
community-banModal-noSites-title = Jeste li sigurni da želite ukloniti zabranu za <username></username>?
community-banModal-allSites-consequence =
  Jednom zabranjen, ovaj korisnik više neće moći komentirati, koristiti
  reakcije ili prijavljivati komentare.
community-banModal-noSites-consequence =
  Jednom uklonjena zabrana, ovaj korisnik će moći komentirati, koristiti reakcije i prijavljivati komentare.
community-banModal-specificSites-consequence =
  Ova radnja će utjecati na koje stranice korisnik može komentirati, koristiti reakcije i prijavljivati komentare.
community-banModal-cancel = Otkaži
community-banModal-updateBan = Spremi
community-banModal-ban = Zabrani
community-banModal-unban = Ukloni zabranu
community-banModal-customize = Prilagodi poruku e-maila o zabrani
community-banModal-reject-existing = Odbij sve komentare ovog korisnika
community-banModal-reject-existing-specificSites = Odbij sve komentare na ovim stranicama
community-banModal-reject-existing-singleSite = Odbij sve komentare na ovoj stranici

community-banModal-noSites = Nema stranica
community-banModal-banFrom = Zabrani s
community-banModal-allSites = Sve stranice
community-banModal-specificSites = Određene stranice

community-suspendModal-areYouSure = Suspendiraj <strong>{ $username }</strong>?
community-suspendModal-consequence =
  Jednom suspendiran, ovaj korisnik više neće moći komentirati, koristiti
  reakcije ili prijavljivati komentare.
community-suspendModal-duration-3600 = 1 sat
community-suspendModal-duration-10800 = 3 sata
community-suspendModal-duration-86400 = 24 sata
community-suspendModal-duration-604800 = 7 dana
community-suspendModal-cancel = Otkaži
community-suspendModal-suspendUser = Suspendiraj korisnika
community-suspendModal-emailTemplate =
  Pozdrav { $username },

  U skladu s pravilima zajednice { $organizationName }, vaš račun je privremeno suspendiran. Tijekom suspenzije, nećete moći komentirati, prijavljivati ili komunicirati s drugim komentatorima. Molimo vas da se ponovno pridružite razgovoru za { framework-timeago-time }.

community-suspendModal-customize = Prilagodi poruku e-maila o suspenziji

community-suspendModal-success =
  <strong>{ $username }</strong> je suspendiran na <strong>{ $duration }</strong>

community-suspendModal-success-close = Zatvori
community-suspendModal-selectDuration = Odaberite duljinu suspenzije

community-premodModal-areYouSure =
  Jeste li sigurni da želite uvijek pre-moderirati <strong>{ $username }</strong>?
community-premodModal-consequence =
  Svi njihovi komentari će ići u red čekanja dok ne uklonite ovaj status.
community-premodModal-cancel = Otkaži
community-premodModal-premodUser = Da, uvijek pre-moderiraj

community-siteRoleModal-assignSites =
  Dodijeli stranice za <strong>{ $username }</strong>
community-siteRoleModal-assignSitesDescription-siteModerator =
  Moderatorima stranica je dopušteno donositi moderacijske odluke i izdavati suspenzije na stranicama kojima su dodijeljeni.
community-siteRoleModal-cancel = Otkaži
community-siteRoleModal-update = Ažuriraj
community-siteRoleModal-selectSites-siteModerator = Odaberite stranice za moderiranje
community-siteRoleModal-selectSites-member = Odaberite stranice za ovog korisnika da bude član
community-siteRoleModal-noSites = Nema stranica

community-invite-inviteMember = Pozovite članove u svoju organizaciju
community-invite-emailAddressLabel = E-mail adresa:
community-invite-inviteMore = Pozovi više
community-invite-inviteAsLabel = Pozovi kao:
community-invite-sendInvitations = Pošalji pozivnice
community-invite-role-staff =
  <strong>Uloga osoblja:</strong> Prima značku "Osoblje", a
  komentari su automatski odobreni. Ne može moderirati
  ili mijenjati bilo koju konfiguraciju { -product-name }.
community-invite-role-moderator =
  <strong>Uloga moderatora:</strong> Prima
  značku "Osoblje", a komentari su automatski
  odobreni. Ima pune moderacijske privilegije (odobravanje,
  odbijanje i isticanje komentara). Može konfigurirati pojedinačne
  članke, ali nema privilegije za konfiguraciju cijele stranice.
community-invite-role-admin =
  <strong>Uloga administratora:</strong> Prima značku "Osoblje", a
  komentari su automatski odobreni. Ima pune
  moderacijske privilegije (odobravanje, odbijanje i isticanje
  komentara). Može konfigurirati pojedinačne članke i ima
  privilegije za konfiguraciju cijele stranice.
community-invite-invitationsSent = Vaše pozivnice su poslane!
community-invite-close = Zatvori
community-invite-invite = Pozovi

community-warnModal-success =
  Upozorenje je poslano <strong>{ $username }</strong>.
community-warnModal-success-close = U redu
community-warnModal-areYouSure = Upozori <strong>{ $username }</strong>?
community-warnModal-consequence = Upozorenje može poboljšati ponašanje komentatora bez suspenzije ili zabrane. Korisnik mora potvrditi upozorenje prije nego što može nastaviti komentirati.
community-warnModal-message-label = Poruka
community-warnModal-message-required = Obavezno
community-warnModal-message-description = Objasnite ovom korisniku kako bi trebao promijeniti svoje ponašanje na vašoj stranici.
community-warnModal-cancel = Otkaži
community-warnModal-warnUser = Upozori korisnika
community-userStatus-warn = Upozori
community-userStatus-warnEverywhere = Upozori svugdje
community-userStatus-message = Poruka

community-modMessageModal-success = Poruka je poslana <strong>{ $username }</strong>.
community-modMessageModal-success-close = U redu
community-modMessageModal-areYouSure = Pošalji poruku <strong>{ $username }</strong>?
community-modMessageModal-consequence = Pošaljite poruku komentatoru koja je vidljiva samo njemu.
community-modMessageModal-message-label = Poruka
community-modMessageModal-message-required = Obavezno
community-modMessageModal-cancel = Otkaži
community-modMessageModal-messageUser = Pošalji poruku korisniku

## Priče
stories-emptyMessage = Trenutno nema objavljenih priča.
stories-noMatchMessage = Nismo mogli pronaći nijednu priču koja odgovara vašim kriterijima.

stories-filter-searchField =
  .placeholder = Pretraži po naslovu priče ili autoru...
  .aria-label = Pretraži po naslovu priče ili autoru
stories-filter-searchButton =
  .aria-label = Pretraži

stories-filter-statusSelectField =
  .aria-label = Pretraži po statusu

stories-changeStatusButton =
  .aria-label = Promijeni status

stories-filter-search = Pretraži
stories-filter-showMe = Pokaži mi
stories-filter-allStories = Sve priče
stories-filter-openStories = Otvorene priče
stories-filter-closedStories = Zatvorene priče

stories-column-title = Naslov
stories-column-author = Autor
stories-column-publishDate = Datum objave
stories-column-status = Status
stories-column-clickToModerate = Kliknite naslov za moderiranje priče
stories-column-reportedCount = Prijavljeno
stories-column-pendingCount = Na čekanju
stories-column-publishedCount = Objavljeno

stories-status-popover =
  .description = Padajući izbornik za promjenu statusa priče

storyInfoDrawer-rescrapeTriggered = Ponovno pokrenuto
storyInfoDrawer-triggerRescrape = Ponovno preuzmi metapodatke
storyInfoDrawer-title = Detalji priče
storyInfoDrawer-titleNotAvailable = Naslov priče nije dostupan
storyInfoDrawer-authorNotAvailable = Autor nije dostupan
storyInfoDrawer-publishDateNotAvailable = Datum objave nije dostupan
storyInfoDrawer-scrapedMetaData = Preuzeti metapodaci
storyInfoDrawer-configure = Konfiguriraj
storyInfoDrawer-storyStatus-open = Otvoreno
storyInfoDrawer-storyStatus-closed = Zatvoreno
storyInfoDrawer-moderateStory = Moderiraj
storyInfoDrawerSettings-premodLinksEnable = Pre-moderiraj komentare koji sadrže linkove
storyInfoDrawerSettings-premodCommentsEnable = Pre-moderiraj sve komentare
storyInfoDrawerSettings-moderation = Moderacija
storyInfoDrawerSettings-moderationMode-pre = Pre
storyInfoDrawerSettings-moderationMode-post = Post
storyInfoDrawerSettings-update = Ažuriraj
storyInfoDrawer-storyStatus-archiving = Arhiviranje
storyInfoDrawer-storyStatus-archived = Arhivirano
storyInfoDrawer-cacheStory-recache = Ponovno keširaj priču
storyInfoDrawer-cacheStory-recaching = Ponovno keširanje
storyInfoDrawer-cacheStory-cached = Keširano
storyInfoDrawer-cacheStory-uncacheStory = Ukloni keširanje priče
storyInfoDrawer-cacheStory-uncaching = Uklanjanje keširanja

## Poziv

invite-youHaveBeenInvited = Pozvani ste da se pridružite { $organizationName }
invite-finishSettingUpAccount = Dovršite postavljanje računa za:
invite-createAccount = Kreiraj račun
invite-passwordLabel = Lozinka
invite-passwordDescription = Mora imati najmanje { $minLength } znakova
invite-passwordTextField =
  .placeholder = Lozinka
invite-usernameLabel = Korisničko ime
invite-usernameDescription = Možete koristiti “_” i “.”
invite-usernameTextField =
  .placeholder = Korisničko ime
invite-oopsSorry = Ups, oprostite!
invite-successful = Vaš račun je kreiran
invite-youMayNowSignIn = Sada se možete prijaviti na { -product-name } koristeći:
invite-goToAdmin = Idi na { -product-name } Admin
invite-goToOrganization = Idi na { $organizationName }
invite-tokenNotFound =
  Navedeni link je nevažeći, provjerite je li ispravno kopiran.

userDetails-banned-on = <strong>Zabranjen dana</strong> { $timestamp }
userDetails-banned-by = <strong>od</strong> { $username }
userDetails-suspended-by = <strong>Suspended by</strong> { $username }
userDetails-suspension-start = <strong>Početak:</strong> { $timestamp }
userDetails-suspension-end = <strong>Kraj:</strong> { $timestamp }

userDetails-warned-on = <strong>Upozoren dana</strong> { $timestamp }
userDetails-warned-by = <strong>od</strong> { $username }
userDetails-warned-explanation = Korisnik nije priznao upozorenje.

configure-general-reactions-title = Reakcije
configure-general-reactions-explanation =
  Omogućite svojoj zajednici da međusobno komunicira i izražava se
  jednim klikom na reakcije. Prema zadanim postavkama, Coral omogućuje komentatorima da "Poštuju"
  komentare jedni drugih.
configure-general-reactions-label = Oznaka reakcije
configure-general-reactions-input =
  .placeholder = Npr. Poštovanje
configure-general-reactions-active-label = Oznaka aktivne reakcije
configure-general-reactions-active-input =
  .placeholder = Npr. Poštovano
configure-general-reactions-sort-label = Oznaka sortiranja
configure-general-reactions-sort-input =
  .placeholder = Npr. Najviše poštovano
configure-general-reactions-preview = Pregled
configure-general-reaction-sortMenu-sortBy = Sortiraj po

configure-general-newCommenter-title = Oznaka novog komentatora
configure-general-newCommenter-explanation = Dodajte <icon></icon> oznaku komentatorima koji su kreirali svoje račune u posljednjih sedam dana.
configure-general-newCommenter-enabled = Omogući oznake novih komentatora

configure-general-badges-title = Oznake članova
configure-general-badges-explanation =
  Prikažite prilagođenu oznaku za korisnike s određenim ulogama. Ova oznaka se pojavljuje
  na streamu komentara i u administratorskom sučelju.
configure-general-badges-label = Tekst oznake
configure-general-badges-staff-member-input =
  .placeholder = Npr. Osoblje
configure-general-badges-moderator-input =
  .placeholder = Npr. Moderator
configure-general-badges-admin-input =
  .placeholder = Npr. Administrator
configure-general-badges-member-input =
  .placeholder = Npr. Član
configure-general-badges-preview = Pregled
configure-general-badges-staff-member-label = Tekst oznake za osoblje
configure-general-badges-admin-label = Tekst oznake za administratore
configure-general-badges-moderator-label = Tekst oznake za moderatore
configure-general-badges-member-label = Tekst oznake za članove

configure-general-rte-title = Komentari s bogatim tekstom
configure-general-rte-express = Omogućite svojoj zajednici više načina izražavanja osim običnog teksta s bogatim tekstualnim formatiranjem.
configure-general-rte-richTextComments = Komentari s bogatim tekstom
configure-general-rte-onBasicFeatures = Uključeno - podebljano, kurziv, blok citati i popisi s točkama
configure-general-rte-additional = Dodatne opcije bogatog teksta
configure-general-rte-strikethrough = Precrtano
configure-general-rte-spoiler = Spoiler
configure-general-rte-spoilerDesc =
  Riječi i fraze formatirane kao Spoiler skrivene su iza
  tamne pozadine dok čitatelj ne odluči otkriti tekst.

configure-general-dsaConfig-title = Skup značajki Zakona o digitalnim uslugama
configure-general-dsaConfig-description =
  Zakon o digitalnim uslugama (DSA) EU zahtijeva da izdavači sa sjedištem u EU ili koji ciljaju građane EU-a pružaju određene značajke svojim komentatorima i moderatorima.
  <br/>
  <br/>
  Coralov alat za DSA uključuje:
  <br/>
  <ul style="padding-inline-start: var(--spacing-5);">
    <li>Namjenski tijek za komentare prijavljene kao nezakonite</li>
    <li>Obavezni razlozi moderacije za svaki odbijeni komentar</li>
    <li>Obavijesti komentatora za prijavu nezakonitih komentara i odbijene komentare</li>
    <li>Obavezni tekst koji objašnjava metode pravnog lijeka/žalbe, ako ih ima</li>
  </ul>
configure-general-dsaConfig-reportingAndModerationExperience =
  Iskustvo prijavljivanja i moderiranja prema DSA
configure-general-dsaConfig-methodOfRedress =
  Odaberite svoju metodu pravnog lijeka
configure-general-dsaConfig-methodOfRedress-explanation =
  Obavijestite korisnike mogu li i kako se mogu žaliti na odluku o moderaciji
configure-general-dsaConfig-methodOfRedress-none = Nijedna
configure-general-dsaConfig-methodOfRedress-email = E-mail
configure-general-dsaConfig-methodOfRedress-email-placeholder = moderation@example.com
configure-general-dsaConfig-methodOfRedress-url = URL
configure-general-dsaConfig-methodOfRedress-url-placeholder = https://moderation.example.com

configure-account-features-title = Značajke upravljanja računima komentatora
configure-account-features-explanation =
  Možete omogućiti i onemogućiti određene značajke koje vaši komentatori mogu koristiti
  unutar svog profila. Ove značajke također pomažu u usklađivanju s GDPR-om.
configure-account-features-allow = Dopustite korisnicima da:
configure-account-features-change-usernames = Mijenjaju svoja korisnička imena
configure-account-features-change-usernames-details = Korisnička imena se mogu mijenjati jednom svakih 14 dana.
configure-account-features-yes = Da
configure-account-features-no = Ne
configure-account-features-download-comments = Preuzmu svoje komentare
configure-account-features-download-comments-details = Komentatori mogu preuzeti csv svoje povijesti komentara.
configure-account-features-delete-account = Izbrišu svoj račun
configure-account-features-delete-account-details =
  Uklanja sve njihove podatke o komentarima, korisničko ime i e-mail adresu s web stranice i baze podataka.

configure-account-features-delete-account-fieldDescriptions =
  Uklanja sve njihove podatke o komentarima, korisničko ime i e-mail
  adresu s web stranice i baze podataka.

configure-advanced-stories = Kreiranje priča
configure-advanced-stories-explanation = Napredne postavke za način na koji se priče kreiraju unutar Coral-a.
configure-advanced-stories-lazy = Lijeno kreiranje priča
configure-advanced-stories-lazy-detail = Omogućite automatsko kreiranje priča kada se objave iz vašeg CMS-a.
configure-advanced-stories-scraping = Preuzimanje priča
configure-advanced-stories-scraping-detail = Omogućite automatsko preuzimanje metapodataka priče kada se objave iz vašeg CMS-a.
configure-advanced-stories-proxy = URL proxyja za preuzimanje
configure-advanced-stories-proxy-detail =
  Kada je navedeno, omogućuje zahtjevima za preuzimanje korištenje navedenog
  proxyja. Svi zahtjevi će tada biti proslijeđeni kroz odgovarajući
  proxy kako ga parsira paket <externalLink>npm proxy-agent</externalLink>.
configure-advanced-stories-custom-user-agent = Prilagođeni zaglavlje korisničkog agenta za preuzimanje
configure-advanced-stories-custom-user-agent-detail =
  Kada je navedeno, nadjačava zaglavlje <code>User-Agent</code> poslano sa svakim
  zahtjevom za preuzimanje.

configure-advanced-stories-authentication = Autentifikacija
configure-advanced-stories-scrapingCredentialsHeader = Kredencijali za preuzimanje
configure-advanced-stories-scraping-usernameLabel = Korisničko ime
configure-advanced-stories-scraping-passwordLabel = Lozinka

commentAuthor-status-banned = Zabranjen
commentAuthor-status-premod = Pre-moderacija
commentAuthor-status-suspended = Suspendiran

hotkeysModal-title = Prečaci na tipkovnici
hotkeysModal-navigation-shortcuts = Prečaci za navigaciju
hotkeysModal-shortcuts-next = Sljedeći komentar
hotkeysModal-shortcuts-prev = Prethodni komentar
hotkeysModal-shortcuts-search = Otvori pretragu
hotkeysModal-shortcuts-jump = Skoči na određeni red
hotkeysModal-shortcuts-switch = Prebaci redove
hotkeysModal-shortcuts-toggle = Prebaci pomoć za prečace
hotkeysModal-shortcuts-single-view = Prikaz jednog komentara
hotkeysModal-moderation-decisions = Odluke o moderaciji
hotkeysModal-shortcuts-approve = Odobri
hotkeysModal-shortcuts-reject = Odbij
hotkeysModal-shortcuts-ban = Zabrani autora komentara
hotkeysModal-shortcuts-zen = Prebaci prikaz jednog komentara

authcheck-network-error = Došlo je do mrežne pogreške. Molimo osvježite stranicu.

dashboard-heading-last-updated = Zadnje ažurirano:

dashboard-today-heading = Današnja aktivnost
dashboard-today-new-comments = Novi komentari
dashboard-alltime-new-comments = Ukupno
dashboard-alltime-new-comments-archiveEnabled = { $value } { $unit ->
    [second] { $value ->
      [1] sekunda
      *[other] sekundi
    }
    [minute] { $value ->
      [1] minuta
      *[other] minuta
    }
    [hour] { $value ->
      [1] sat
      *[other] sati
    }
    [day] { $value ->
      [1] dan
      *[other] dana
    }
    [week] { $value ->
      [1] tjedan
      *[other] tjedana
    }
    [month] { $value ->
      [1] mjesec
      *[other] mjeseci
    }
    [year] { $value ->
      [1] godina
      *[other] godina
    }
    *[other] nepoznata jedinica
  } ukupno
dashboard-today-rejections = Stopa odbijanja
dashboard-alltime-rejections = Prosjek svih vremena
dashboard-alltime-rejections-archiveEnabled = { $value } { $unit ->
    [second] { $value ->
      [1] sekunda
      *[other] sekundi
    }
    [minute] { $value ->
      [1] minuta
      *[other] minuta
    }
    [hour] { $value ->
      [1] sat
      *[other] sati
    }
    [day] { $value ->
      [1] dan
      *[other] dana
    }
    [week] { $value ->
      [1] tjedan
      *[other] tjedana
    }
    [month] { $value ->
      [1] mjesec
      *[other] mjeseci
    }
    [year] { $value ->
      [1] godina
      *[other] godina
    }
    *[other] nepoznata jedinica
  } prosjek
dashboard-today-staffPlus-comments = Komentari osoblja+
dashboard-alltime-staff-comments = Ukupno komentara osoblja
dashboard-alltime-staff-comments-archiveEnabled = { $value } { $unit ->
    [second] { $value ->
      [1] sekunda
      *[other] sekundi
    }
    [minute] { $value ->
      [1] minuta
      *[other] minuta
    }
    [hour] { $value ->
      [1] sat
      *[other] sati
    }
    [day] { $value ->
      [1] dan
      *[other] dana
    }
    [week] { $value ->
      [1] tjedan
      *[other] tjedana
    }
    [month] { $value ->
      [1] mjesec
      *[other] mjeseci
    }
    [year] { $value ->
      [1] godina
      *[other] godina
    }
    *[other] nepoznata jedinica
  } ukupno
dashboard-today-signups = Novi članovi zajednice
dashboard-alltime-signups = Ukupno članova
dashboard-today-bans = Zabranjeni članovi
dashboard-alltime-bans = Ukupno zabranjenih članova

dashboard-top-stories-today-heading = Današnje najkomentiranije priče
dashboard-top-stories-table-header-story = Priča
dashboard-top-stories-table-header-comments = Komentari
dashboard-top-stories-no-comments = Danas nema komentara

dashboard-commenters-activity-heading = Novi članovi zajednice ovog tjedna

dashboard-comment-activity-heading = Satna aktivnost komentara
dashboard-comment-activity-tooltip-comments = Komentari
dashboard-comment-activity-legend = Prosjek zadnja 3 dana

conversation-modal-conversationOn = Razgovor o:
conversation-modal-moderateStory = Moderiraj priču
conversation-modal-showMoreParents = Prikaži više ovog razgovora
conversation-modal-showReplies = Prikaži odgovore
conversation-modal-commentNotFound = Komentar nije pronađen.
conversation-modal-showMoreReplies = Prikaži više odgovora
conversation-modal-header-title = Razgovor o:
conversation-modal-header-moderate-link = Moderiraj priču
conversation-modal-rejectButton = <icon></icon>Odbij
  .aria-label = Odbij
conversation-modal-rejectButton-rejected = <icon></icon>Odbijeno
  .aria-label = Odbijeno

# DSA Reports tab
reportsTable-column-created = Kreirano
reportsTable-column-lastUpdated = Zadnje ažurirano
reportsTable-column-reportedBy = Prijavio
reportsTable-column-reference = Referenca
reportsTable-column-lawBroken = Prekršen zakon
reportsTable-column-commentAuthor = Autor komentara
reportsTable-column-status = Status
reportsTable-emptyReports = Nema DSA izvještaja za prikaz.

reports-sortMenu-newest = Najnovije
reports-sortMenu-oldest = Najstarije
reports-sortMenu-sortBy = Sortiraj po

reports-table-showClosedReports = Prikaži zatvorene izvještaje
reports-table-showOpenReports = Prikaži otvorene izvještaje

reports-singleReport-reportsLinkButton = <icon></icon> Svi DSA izvještaji
reports-singleReport-reportID = ID izvještaja
reports-singleReport-shareButton = <icon></icon> CSV
reports-singleReport-reporter = Prijavitelj
reports-singleReport-reporterNameNotAvailable = Ime prijavitelja nije dostupno
reports-singleReport-reportDate = Datum izvještaja
reports-singleReport-lawBroken = Koji zakon je prekršen?
reports-singleReport-explanation = Objašnjenje
reports-singleReport-comment = Komentar
reports-singleReport-comment-notAvailable = Ovaj komentar nije dostupan.
reports-singleReport-comment-deleted = Ovaj komentar više nije dostupan. Komentator je izbrisao svoj račun.
reports-singleReport-comment-edited = (uređeno)
reports-singleReport-comment-viewCommentStream = Prikaži komentar u streamu
reports-singleReport-comment-viewCommentModeration = Prikaži komentar u moderaciji
reports-singleReport-comment-rejected = Odbijeno
reports-singleReport-comment-unavailableInStream = Nedostupno u streamu
reports-singleReport-commentOn = Komentar na
reports-singleReport-history = Povijest
reports-singleReport-history-reportSubmitted = Prijava nezakonitog sadržaja podnesena
reports-singleReport-history-addedNote = { $username } je dodao bilješku
reports-singleReport-history-deleteNoteButton = <icon></icon> Izbriši
reports-singleReport-history-madeDecision-illegal = { $username } je donio odluku da ovaj izvještaj sadrži potencijalno nezakonit sadržaj
reports-singleReport-history-madeDecision-legal = { $username } je donio odluku da ovaj izvještaj ne sadrži potencijalno nezakonit sadržaj
reports-singleReport-history-legalGrounds = Pravna osnova: { $legalGrounds }
reports-singleReport-history-explanation = Objašnjenje: { $explanation }
reports-singleReport-history-changedStatus = { $username } je promijenio status u { $status }
reports-singleReport-reportVoid = Korisnik je izbrisao svoj račun. Izvještaj je nevažeći.
reports-singleReport-history-sharedReport = { $username } je preuzeo ovaj izvještaj
reports-singleReport-note-field =
  .placeholder = Dodajte svoju bilješku...
reports-singleReport-addUpdateButton = <icon></icon> Dodaj ažuriranje
reports-singleReport-decisionLabel = Odluka
reports-singleReport-decision-legalGrounds = Pravna osnova
reports-singleReport-decision-explanation = Detaljno objašnjenje
reports-singleReport-makeDecisionButton = <icon></icon> Odluka
reports-singleReport-decision-doesItContain = Sadrži li ovaj komentar potencijalno nezakonit sadržaj?
reports-singleReport-decision-doesItContain-yes = Da
reports-singleReport-decision-doesItContain-no = Ne

reports-status-awaitingReview = Čeka na pregled
reports-status-inReview = U pregledu
reports-status-completed = Dovršeno
reports-status-void = Nevažeće
reports-status-unknown = Nepoznat status

reports-changeStatusModal-prompt-addNote = Dodali ste bilješku. Želite li ažurirati svoj status na U pregledu.
reports-changeStatusModal-prompt-downloadReport = Preuzeli ste izvještaj. Želite li ažurirati svoj status na U pregledu.
reports-changeStatusModal-prompt-madeDecision = Donijeli ste odluku. Želite li ažurirati svoj status na Dovršeno.
reports-changeStatusModal-updateButton = Da, ažuriraj
reports-changeStatusModal-dontUpdateButton = Ne
reports-changeStatusModal-header = Ažuriraj status?

reports-decisionModal-header = Odluka o izvještaju
reports-decisionModal-prompt = Čini li se da ovaj komentar sadrži potencijalno nezakonit sadržaj?
reports-decisionModal-yes = Da
reports-decisionModal-no = Ne
reports-decisionModal-submit = Pošalji
reports-decisionModal-lawBrokenLabel = Prekršen zakon
reports-decisionModal-lawBrokenTextfield =
  .placeholder = Dodaj zakon...
reports-decisionModal-detailedExplanationLabel = Detaljno objašnjenje
reports-decisionModal-detailedExplanationTextarea =
  .placeholder = Dodaj objašnjenje...

reports-relatedReports-label = Povezani izvještaji
reports-relatedReports-reportIDLabel = ID izvještaja

reports-anonymousUser = Anonimni korisnik
reports-username-not-available = Korisničko ime nije dostupno

# Kontrolna ploča

controlPanel-redis-redis = Redis
controlPanel-redis-flushRedis = Očisti Redis
controlPanel-redis-flush = Očisti
