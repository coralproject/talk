import { Localized } from "fluent-react/compat";
import React, {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { UNIT } from "coral-common/helpers/i18n";
import {
  Flex,
  Option,
  SelectField,
  TextField,
  Typography,
} from "coral-ui/components";

import styles from "./DurationField.css";

/**
 * DURATION_UNIT are units that can be used in the
 * DurationField components.
 */
export const DURATION_UNIT = UNIT;

const DURATION_UNIT_MAP = {
  [DURATION_UNIT.SECONDS]: "second",
  [DURATION_UNIT.MINUTES]: "minute",
  [DURATION_UNIT.HOURS]: "hour",
  [DURATION_UNIT.DAYS]: "day",
  [DURATION_UNIT.WEEKS]: "week",
};

interface Props {
  name: string;
  value: string;
  disabled: boolean;
  onChange: (v: string) => void;
  /** Specifiy units to include */
  units?: ReadonlyArray<UNIT>;
}

function convertToSeconds(value: string, unit?: UNIT) {
  const parsed = parseInt(value, 10);
  return (isNaN(parsed) || !unit ? value : parsed * unit).toString();
}

function convertFromSeconds(
  value: string,
  units: ReadonlyArray<UNIT>,
  unit?: UNIT
) {
  const parsed = parseInt(value, 10);

  // If value was a valid number..
  if (!isNaN(parsed)) {
    // If unit is not set, we'll find the best matching unit.
    if (!unit) {
      // Start from the first unit,
      // keep first unit if value is set to 0,
      // otherwise use better matching unit if the value is fully dividable by the unit.
      unit = units.reduce((x, cur) =>
        parsed % cur === 0 && parsed !== 0 ? cur : x
      );
    }
    // Compute new value relative to the selected unit.
    value = (parsed / unit).toString();
  }

  return {
    unit,
    value,
  };
}

/**
 * Duration Field renders a TextField that accepts a number and a SelectField with a unit.
 * If the entered value is a valid number, it'll propagate the computed value in seconds via
 * onChange otherwise it'll just propogate whatever was entered as the value TextField.
 */
const DurationField: FunctionComponent<Props> = ({
  value,
  units,
  onChange,
  disabled,
  name,
}) => {
  units = units || [UNIT.HOURS, UNIT.DAYS, UNIT.WEEKS];

  const [selectedUnit, setSelectedUnit] = useState(
    convertFromSeconds(value, units).unit
  );

  useEffect(() => {
    // set default value for selectedUnit if not previously set
    if (!selectedUnit) {
      setSelectedUnit(convertFromSeconds(value, units!).unit);
    }
  }, [value]);

  const elementCallbacks = useMemo(
    () => units!.map(k => DURATION_UNIT_MAP[k]),
    [units]
  );

  const { value: computedValue } = useMemo(
    () => convertFromSeconds(value, units!, selectedUnit),
    [value, selectedUnit]
  );

  const handleValueChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(convertToSeconds(e.target.value, selectedUnit));
    },
    [onChange, selectedUnit]
  );

  const handleUnitChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const unit = parseInt(e.target.value, 10);
      setSelectedUnit(unit);
      onChange(convertToSeconds(computedValue, unit));
    },
    [setSelectedUnit, onChange, computedValue]
  );

  return (
    <Flex itemGutter>
      <TextField
        className={styles.value}
        name={`${name}-value`}
        onChange={handleValueChange}
        value={computedValue}
        disabled={disabled}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        textAlignCenter
        aria-label="value"
      />
      {elementCallbacks.length === 1 ? (
        <Localized
          id="framework-durationField-unit"
          $unit={elementCallbacks[0]}
          $value={parseInt(computedValue, 10)}
        >
          <Typography variant="bodyCopy" className={styles.unit}>
            {elementCallbacks[0]}
          </Typography>
        </Localized>
      ) : (
        <SelectField
          name={`${name}-unit`}
          onChange={handleUnitChange}
          disabled={disabled}
          aria-label="unit"
          classes={{
            select: styles.select,
          }}
          value={(selectedUnit || units[0]).toString()}
        >
          {elementCallbacks.map((unit, i) => {
            const val = units![i];
            return (
              <Localized
                id="framework-durationField-unit"
                $unit={unit}
                $value={parseInt(computedValue, 10)}
                key={i}
              >
                <Option value={val.toString()}>{unit}</Option>
              </Localized>
            );
          })}
        </SelectField>
      )}
    </Flex>
  );
};

export default DurationField;
