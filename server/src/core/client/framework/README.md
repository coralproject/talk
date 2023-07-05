# Framework

All our client targets (e.g. stream, admin, ...) are based functionality provided by this framework.

## What should be inside `framework`

- Code that are specific to a certain target (e.g. stream, admin, ...) must not live here.
- Code that are shared by different targets should be put in `framework`
