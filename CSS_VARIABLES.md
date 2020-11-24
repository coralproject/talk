
# CSS Variables

Coral defines a set of CSS Variables that you can use to broadly customize the
look and feel of your comment stream. For example you can easily redefine the colors
or fonts that are being used.

To change the CSS Variables, use the following example in your custom CSS file:

```
:root {
  --font-family-primary: 'Verdana';
  --round-corners: 0px;
}
```

The following list contains the CSS Variables that can be customized.

**Info**: *Before 6.3.0 Coral uses a different set of CSS Variables. If you are still using
the old CSS Variables, please upgrade. Currently we have a compatibility layer to bridge the old CSS Variables to the new ones. This mechanism will be removed in the future.*

<!-- START docs:css-variables -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN npm run docs:css-variables -->
### Index
- <a href="#variables">Variables</a>
  - <a href="#palette">palette</a>
    - <a href="#palette-primary">palette-primary</a>
    - <a href="#palette-background">palette-background</a>
    - <a href="#palette-text">palette-text</a>
    - <a href="#palette-grey">palette-grey</a>
    - <a href="#palette-error">palette-error</a>
    - <a href="#palette-success">palette-success</a>
    - <a href="#palette-warning">palette-warning</a>
  - <a href="#font-family">font-family</a>
  - <a href="#font-weight">font-weight</a>
    - <a href="#font-weight-primary">font-weight-primary</a>
    - <a href="#font-weight-secondary">font-weight-secondary</a>
  - <a href="#font-size">font-size</a>
  - <a href="#shadow">shadow</a>
  - <a href="#spacing">spacing</a>
  - <a href="#mini-unit">mini-unit</a>


### Variables

Use this to remove round corners or make them more round.

`--round-corners: 3px;`

### palette

`--palette-divider: rgba(0, 0, 0, 0.12);`

#### palette-primary

Color palette that is used as the primary color.

`--palette-primary-100: #EBF6FF;  /* Before 6.3.0: --palette-primary-lightest */`

`--palette-primary-200: #B7DCFF;  /* Before 6.3.0: --palette-primary-lighter */`

`--palette-primary-300: #61B3FF;  /* Before 6.3.0: --palette-primary-light */`

`--palette-primary-400: #2897FF;  /* Before 6.3.0: --palette-primary-main */`

`--palette-primary-500: #0070D9;  /* Before 6.3.0: --palette-primary-main */`

`--palette-primary-600: #0062BE;  /* Before 6.3.0: --palette-primary-main */`

`--palette-primary-700: #005AAE;  /* Before 6.3.0: --palette-primary-main */`

`--palette-primary-800: #004688;  /* Before 6.3.0: --palette-primary-dark */`

`--palette-primary-900: #00386D;  /* Before 6.3.0: --palette-primary-darkest */`

#### palette-background

Color palette that is used for background colors.

`--palette-background-body: #FFFFFF;`

`--palette-background-popover: #FFFFFF;`

`--palette-background-tooltip: #65696B;`

`--palette-background-input: #FFFFFF;`

`--palette-background-input-disabled: #EFEFEF;`

#### palette-text

Color palette that is used for text.

`--palette-text-000: #FFFFFF;  /* Before 6.3.0: --palette-text-light */`

`--palette-text-100: #65696B;  /* Before 6.3.0: --palette-text-secondary */`

`--palette-text-500: #353F44;  /* Before 6.3.0: --palette-text-primary */`

`--palette-text-900: #14171A;  /* Before 6.3.0: --palette-text-dark */`

`--palette-text-placeholder: #9FA4A6;  /* Before 6.3.0: --palette-grey-lighter */`

`--palette-text-input-disabled: #9FA4A6;  /* Before 6.3.0: --palette-grey-lighter */`

#### palette-grey

Color palette that is used for grey shades.

`--palette-grey-100: #F4F7F7;  /* Before 6.3.0: --palette-grey-lightest */`

`--palette-grey-200: #EAEFF0;  /* Before 6.3.0: --palette-grey-lightest */`

`--palette-grey-300: #CBD1D2;  /* Before 6.3.0: --palette-grey-lighter */`

`--palette-grey-400: #9FA4A6;  /* Before 6.3.0: --palette-grey-lighter */`

`--palette-grey-500: #65696B;  /* Before 6.3.0: --palette-grey-main */`

`--palette-grey-600: #49545C;  /* Before 6.3.0: --palette-grey-dark */`

`--palette-grey-700: #32404D;  /* Before 6.3.0: --palette-grey-darkest */`

`--palette-grey-800: #202E3E;  /* Before 6.3.0: --palette-grey-darkest */`

`--palette-grey-900: #132033;  /* Before 6.3.0: --palette-grey-darkest */`

#### palette-error

Color palette that is used for indicating something is error red.

`--palette-error-100: #FCE5D9;  /* Before 6.3.0: --palette-error-lightest */`

`--palette-error-200: #FAC6B4;  /* Before 6.3.0: --palette-error-lighter */`

`--palette-error-300: #F29D8B;  /* Before 6.3.0: --palette-error-lighter */`

`--palette-error-400: #E5766C;  /* Before 6.3.0: --palette-error-light */`

`--palette-error-500: #D53F3F;  /* Before 6.3.0: --palette-error-main */`

`--palette-error-600: #B72E39;  /* Before 6.3.0: --palette-error-main */`

`--palette-error-700: #991F34;  /* Before 6.3.0: --palette-error-dark */`

`--palette-error-800: #7B142E;  /* Before 6.3.0: --palette-error-darkest */`

`--palette-error-900: #660C2B;  /* Before 6.3.0: --palette-error-darkest */`

#### palette-success

Color palette that is used for indicating something is success green.

`--palette-success-100: #D8F9D5;  /* Before 6.3.0: --palette-success-lightest */`

`--palette-success-200: #ADF3AD;  /* Before 6.3.0: --palette-success-lighter */`

`--palette-success-300: #7CDB85;  /* Before 6.3.0: --palette-success-lighter */`

`--palette-success-400: #54B767;  /* Before 6.3.0: --palette-success-light */`

`--palette-success-500: #268742;  /* Before 6.3.0: --palette-success-main */`

`--palette-success-600: #1B743D;  /* Before 6.3.0: --palette-success-main */`

`--palette-success-700: #136138;  /* Before 6.3.0: --palette-success-dark */`

`--palette-success-800: #0C4E32;  /* Before 6.3.0: --palette-success-darkest */`

`--palette-success-900: #07402E;  /* Before 6.3.0: --palette-success-darkest */`

#### palette-warning

Color palette that is used for indicating a warning and is usually yellow.

`--palette-warning-100: #FFFACC;  /* Before 6.3.0: --palette-warning-main */`

`--palette-warning-500: #FFE91F;  /* Before 6.3.0: --palette-warning-main */`

`--palette-warning-900: #FFCC15;  /* Before 6.3.0: --palette-warning-main */`

### font-family

Different font families currently in use.

`--font-family-primary: "Open Sans", sans-serif;  /* Before 6.3.0: --font-family-sans-serif */`

`--font-family-secondary: "Nunito";  /* Before 6.3.0: --font-family-serif */`

### font-weight

Different font weights with matching values for the fonts.

#### font-weight-primary

`--font-weight-primary-bold: 700;  /* Before 6.3.0: --font-weight-bold */`

`--font-weight-primary-semi-bold: 600;  /* Before 6.3.0: --font-weight-medium */`

`--font-weight-primary-regular: 300;  /* Before 6.3.0: --font-weight-light */`

#### font-weight-secondary

`--font-weight-secondary-bold: 700;  /* Before 6.3.0: --font-weight-bold */`

`--font-weight-secondary-regular: 300;  /* Before 6.3.0: --font-weight-light */`

### font-size

`--font-size-1: 0.75rem;`

`--font-size-2: 0.875rem;`

`--font-size-3: 1rem;`

`--font-size-4: 1.125rem;`

`--font-size-5: 1.25rem;`

`--font-size-6: 1.5rem;`

`--font-size-7: 1.75rem;`

`--font-size-8: 2rem;`

`--font-size-9: 2.25rem;`

`--font-size-icon-xl: 2.25rem;`

`--font-size-icon-lg: 1.5rem;`

`--font-size-icon-md: 1.125rem;`

`--font-size-icon-sm: 0.875rem;`

`--font-size-icon-xs: 0.75rem;`

### shadow

Different shadows that are currently used in Coral.

`--shadow-popover: 1px 0px 4px rgba(0, 0, 0, 0.25);  /* Before 6.3.0: --elevation-main */`

### spacing

Different spacing units currenty used in Coral.

`--spacing-1: 4px;`

`--spacing-2: 8px;`

`--spacing-3: 12px;`

`--spacing-4: 16px;`

`--spacing-5: 24px;`

`--spacing-6: 32px;`

`--spacing-7: 44px;`

`--spacing-8: 60px;`

`--spacing-9: 84px;`

### mini-unit

Grid units for smaller and larger screens.

`--mini-unit-small: 4;`

`--mini-unit-large: 8;`

<!-- END docs:css-variables -->
