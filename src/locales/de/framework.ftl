### Localizations for framework.
### All keys must start with `framework` because this file is shared
### among different targets.

framework-validation-required = Dies ist ein Pflichtpfeld.

framework-timeago =
  { $suffix ->
    [ago] vor
    [in] in
  }
  { $value }
  { $unit ->
    [second] { $value ->
       [1] Sekunde
      *[other] Sekunden
    }
    [minuto] { $value ->
       [1] Minute
      *[other] Minuten
    }
    [hour] { $value ->
       [0] Stunde
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
    *[other] unknown unit
  }
