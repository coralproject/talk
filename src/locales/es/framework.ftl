### Localizations for the talk framework.
### All keys must start with `framework` because this file is shared
### among different targets.

framework-timeago =
  { $value ->
    [0] ahora
    *[other]
      { $suffix ->
        [ago] hace
        [in] en
        *[other] unknown suffix
      }
      { $value }
      { $unit ->
        [second] { $value ->
          [1] segundo
          *[other] segundos
        }
        [minute] { $value ->
          [1] minuto
          *[other] minutos
        }
        [hour] { $value ->
          [0] hora
          *[other] horas
        }
        [day] { $value ->
          [1] dia
          *[other] dias
        }
        [week] { $value ->
          [1] semana
          *[other] semanas
        }
        [month] { $value ->
          [1] mes
          *[other] meses
        }
        [year] { $value ->
          [1] año
          *[other] años
        }
        *[other] unknown unit
      }
  }
