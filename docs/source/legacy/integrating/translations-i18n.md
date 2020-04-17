---
title: Translations and i18n
permalink: /integrating/translations-i18n/
---

We’re so proud to have received submissions from a lot of 3rd party contributors translating Talk into their own languages.

### Languages

You can see what languages Talk currently supports here: https://github.com/coralproject/talk/tree/master/locales

You can set the default language Talk uses by setting `TALK_DEFAULT_LANG` in your ENV. 

### Changing the Language

To change Talk's language, to see what translations are missing, or to troubleshoot translations, you can update the language in the local storage of your browser, by typing this into your browser console:

`localStorage.setItem('locale', 'fr')`

That would set the language to French.

### Contributing a Translation

To add a new Talk translation, simply translate the `en.yml` file (https://github.com/coralproject/talk/blob/master/locales/en.yml) into a new yml file with the language code of your choice. You can find supported language codes here: http://www.localeplanet.com/icu/iso639.html

If you are a developer contributing a new language, you'll need to add the required i18n support in the i18n files (or you can leave that to us if you like). If you're a non-developer, you can submit the translation via GitHub if you feel comfortable doing that, or feel free to email it to us via our Support: support@coralproject.net

If you want to suggest a new language or put a placeholder for a translation you’re working on, feel free to create a GitHub issue: https://github.com/coralproject/talk/issues/new
