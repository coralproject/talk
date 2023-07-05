import { Localized } from "@fluent/react/compat";
import React, {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import TIME from "coral-common/time";
import { Flex } from "coral-ui/components/v2";

import { Option, SelectField } from "../SelectField";
import TextField, { TextFieldProps } from "../TextField";

import styles from "./DurationField.css";

/**
 * DURATION_UNIT are units that can be used in the
 * DurationField components.
 */
export const DURATION_UNIT = TIME;

const DURATION_UNIT_MAP = {
  [DURATION_UNIT.SECOND]: "second",
  [DURATION_UNIT.MINUTE]: "minute",
  [DURATION_UNIT.HOUR]: "hour",
  [DURATION_UNIT.DAY]: "day",
  [DURATION_UNIT.WEEK]: "week",
};

interface Props extends Pick<TextFieldProps, "color" | "name" | "disabled"> {
  value: string;
  defaultValue?: string;
  onChange: (v: string) => void;
  /** Specifiy units to include */
  units?: ReadonlyArray<TIME>;
}

function convertToSeconds(value: string, unit?: TIME) {
  const parsed = parseInt(value, 10);
  return (isNaN(parsed) || !unit ? value : parsed * unit).toString();
}

function convertFromSeconds(
  value: string,
  units: ReadonlyArray<TIME>,
  unit?: TIME
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
  units = [TIME.HOUR, TIME.DAY, TIME.WEEK],
  onChange,
  defaultValue = "",
  disabled,
  name,
  color,
}) => {
  if (value.length < 1) {
    value = defaultValue;
  }
  const [selectedUnit, setSelectedUnit] = useState(
    convertFromSeconds(value, units).unit
  );

  // If value changes, and selectedUnit has not been set, then set the value.
  useEffect(() => {
    if (!selectedUnit) {
      setSelectedUnit(convertFromSeconds(value, units).unit);
    }
  }, [selectedUnit, units, value]);

  const elementCallbacks = useMemo(
    () => units.map((k) => DURATION_UNIT_MAP[k]),
    [units]
  );

  const { value: computedValue } = useMemo(
    () => convertFromSeconds(value, units, selectedUnit),
    [value, units, selectedUnit]
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
        name={`${name}-value`}
        className={styles.value}
        onChange={handleValueChange}
        value={computedValue}
        disabled={disabled}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        textAlignCenter
        aria-label="value"
        color={color || "regular"}
      />
      {elementCallbacks.length === 1 ? (
        <Localized
          id="framework-durationField-unit"
          vars={{
            unit: elementCallbacks[0],
            value: parseInt(computedValue, 10),
          }}
        >
          <span className={styles.unit}>{elementCallbacks[0]}</span>
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
            const val = units[i];
            return (
              <Localized
                id="framework-durationField-unit"
                vars={{ unit, value: parseInt(computedValue, 10) }}
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
