### Localizations for framework.
### All keys must start with `framework` because this file is shared
### among different targets.

## Validation

framework-validation-required = Dies ist ein Pflichtfeld.

framework-timeago-just-now = Gerade eben
framework-timeago =
  { $suffix ->
     [ago] vor
    *[unknown] unbekannt
  }
  { $value }
  { $unit ->
    [second] { $value ->
       [1] Sekunde
      *[other] Sekunden
    }
    [minute] { $value ->
       [1] Minute
      *[other] Minuten
    }
    [hour] { $value ->
       [1] Stunde
      *[other] Stunden
    }
    [day] { $value ->
       [1] Tag
      *[other] Tage
    }
    [week] { $value ->
       [1] Woche
      *[other] Wochen
    }
    [month] { $value ->
      [1] Monat
      *[other] Monate
    }
    [year] { $value ->
       [1] Jahr
      *[other] Jahre
    }
    *[other] Unbekannte Einheit
  }
