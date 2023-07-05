### Localizations for the framework.
### All keys must start with `framework` because this file is shared
### among different targets.

## Short Number

# Implementation based on unicode Short Number patterns
# http://cldr.unicode.org/translation/number-patterns#TOC-Short-Numbers

framework-shortNumber-1000 = 0.0k
framework-shortNumber-10000 = 00k
framework-shortNumber-100000 = 000k
framework-shortNumber-1000000 = 0.0M
framework-shortNumber-10000000 = 00M
framework-shortNumber-100000000 = 000M
framework-shortNumber-1000000000 = 0.0B

## Validation


framework-timeago-just-now = Nou

framework-timeago-time =
  { $value } { $unit ->
    [second] { $value ->
      [1] sekonde
      *[other] sekondes
    }
    [minute] { $value ->
      [1] minuut
      *[other] minute
    }
    [hour] { $value ->
      [1] uur
      *[other] ure
    }
    [day] { $value ->
      [1] dag
      *[other] dae
    }
    [week] { $value ->
      [1] week
      *[other] weke
    }
    [month] { $value ->
      [1] maand
      *[other] maande
    }
    [year] { $value ->
      [1] jaar
      *[other] jare
    }
    *[other] onbekende eenheid
  }

framework-timeago =
  { $suffix ->
    [ago] {framework-timeago-time} gelede
    *[noSuffix] {framework-timeago-time}
  }

## Components

### Copy Button
framework-copyButton-copy = Kopieër
framework-copyButton-copied = Gekopieër

### Password Field

### Markdown Editor

### Duration Field
framework-durationField-unit =
  { $unit ->
    [second] { $value ->
      [1] Sekonde
      *[other] Sekondes
    }
    [minute] { $value ->
      [1] Minuut
      *[other] Minute
    }
    [hour] { $value ->
      [1] Uur
      *[other] Ure
    }
    [day] { $value ->
      [1] Dag
      *[other] Dae
    }
    [week] { $value ->
      [1] Week
      *[other] Weke
    }
    *[other] onbekende eenheid
  }

framework-starRating =
  .aria-label = { $value ->
    [1] 1 Ster
    *[other] {$value} Sterre
  }
