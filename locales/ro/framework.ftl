### Localizations for framework.
### All keys must start with `framework` because this file is shared
### among different targets.

## Validation

framework-validation-required = Validarea este necesara.

framework-timeago-just-now = Acum un moment
framework-timeago-time =
  { $value } { $unit ->
    [second] { $value ->
      [1] secundă
      *[other] secunde
    }
    [minute] { $value ->
      [1] minut
      *[other] minute
    }
    [hour] { $value ->
      [1] oră
      *[other] ore
    }
    [day] { $value ->
      [1] zi
      *[other] zile
    }
    [week] { $value ->
      [1] saptămână
      *[other] saptămâni
    }
    [month] { $value ->
      [1] luna
      *[other] luni
    }
    [year] { $value ->
      [1] an
      *[other] ani
    }
    *[other] unitate necunoscută
  }

framework-timeago =
  { $suffix ->
    [ago] acum {framework-timeago-time}
    *[noSuffix] {framework-timeago-time}
  }
