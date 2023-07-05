### Localizations for the coral framework.
### All keys must start with `framework` because this file is shared
### among different targets.

framework-timeago-just-now = Hace poco
framework-timeago =
  { $value ->
    *[other]
      { $suffix ->
        [ago] hace
        *[unknown] desconocido
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
          [1] hora
          *[other] horas
        }
        [day] { $value ->
          [1] día
          *[other] días
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
        *[other] unidad desconocida
      }
  }
