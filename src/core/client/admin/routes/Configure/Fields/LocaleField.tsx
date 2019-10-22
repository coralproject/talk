import React, { FunctionComponent } from "react";

import { Option, SelectField } from "coral-admin/ui/components";
import { LanguageCode, LOCALES_MAP } from "coral-common/helpers/i18n";
import { PropTypesOf } from "coral-framework/types";

interface Props extends PropTypesOf<typeof SelectField> {
  value: LanguageCode;
}

const LocaleField: FunctionComponent<Props> = props => {
  return (
    <SelectField {...props}>
      {Object.keys(LOCALES_MAP).map((lang: LanguageCode) => {
        return (
          <Option value={lang} key={lang}>
            {LOCALES_MAP[lang]}
          </Option>
        );
      })}
    </SelectField>
  );
};

export default LocaleField;
