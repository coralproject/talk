import { Localized } from "fluent-react/compat";
import React, { ChangeEvent, Component } from "react";

import { Flex, Option, SelectField, TextField } from "talk-ui/components";

import styles from "./DurationField.css";

/**
 * DURATION_UNIT are units that can be used in the
 * DurationField components.
 */
export enum DURATION_UNIT {
  SECONDS = 1,
  MINUTES = 60,
  HOURS = 3600,
  DAYS = 86400,
  WEEKS = 604800,
}

type UnitElementCallback = (
  currentValue: DURATION_UNIT,
  unitValue: string
) => React.ReactElement<any>;

// This is used to render the Option elements to inlcude in the select field.
const unitElementMap: Record<DURATION_UNIT, UnitElementCallback> = {
  [DURATION_UNIT.SECONDS]: (currentValue, unitValue) => (
    <Localized
      id="framework-durationField-seconds"
      $value={currentValue}
      key={unitValue}
    >
      <Option value={unitValue}>Seconds</Option>
    </Localized>
  ),
  [DURATION_UNIT.MINUTES]: (currentValue, unitValue) => (
    <Localized
      id="framework-durationField-minutes"
      $value={currentValue}
      key={unitValue}
    >
      <Option value={unitValue}>Minutes</Option>
    </Localized>
  ),
  [DURATION_UNIT.HOURS]: (currentValue, unitValue) => (
    <Localized
      id="framework-durationField-hours"
      $value={currentValue}
      key={unitValue}
    >
      <Option value={unitValue}>Hours</Option>
    </Localized>
  ),
  [DURATION_UNIT.DAYS]: (currentValue, unitValue) => (
    <Localized
      id="framework-durationField-days"
      $value={currentValue}
      key={unitValue}
    >
      <Option value={unitValue}>Days</Option>
    </Localized>
  ),
  [DURATION_UNIT.WEEKS]: (currentValue, unitValue) => (
    <Localized
      id="framework-durationField-weeks"
      $value={currentValue}
      key={unitValue}
    >
      <Option value={unitValue}>Weeks</Option>
    </Localized>
  ),
};

interface Props {
  name: string;
  value: string;
  disabled: boolean;
  onChange: (v: string) => void;
  /** Specifiy units to include */
  units?: ReadonlyArray<DURATION_UNIT>;
}

interface State {
  /** Current value */
  value: string;
  /** Current unit */
  unit?: DURATION_UNIT;
  /** All available units */
  units: ReadonlyArray<DURATION_UNIT>;
  /**
   * Element callbacks to generate the rendered
   * Option element for the select field
   */
  elementCallbacks: ReadonlyArray<UnitElementCallback>;
}

/**
 * valueToState converts the value we receive from props to a new state.
 * @param value The value that was passed through props.
 * @param units The units that we use.
 * @param unit The current value if any otherwise the best matching unit will be used.
 */
function valueToState(
  value: string,
  units: ReadonlyArray<DURATION_UNIT>,
  unit?: DURATION_UNIT
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
    units,
    elementCallbacks: units.map(k => unitElementMap[k]),
  };
}

/**
 * stateToValue converts current state to the value we pass to onChange.
 * @param state
 */
function stateToValue(state: State) {
  const parsed = parseInt(state.value, 10);
  // If state.value was a number, return computed result, otherwise return the string.
  return (isNaN(parsed) ? state.value : parsed * state.unit!).toString();
}

/**
 * Duration Field renders a TextField that accepts a number and a SelectField with a unit.
 * If the entered value is a valid number, it'll propagate the computed value in seconds via
 * onChange otherwise it'll just propogate whatever was entered as the value TextField.
 */
class DurationField extends Component<Props, State> {
  public static defaultProps: Partial<Props> = {
    units: [DURATION_UNIT.HOURS, DURATION_UNIT.DAYS, DURATION_UNIT.WEEKS],
  };

  public state: State = valueToState(this.props.value, this.props.units!);

  public componentWillReceiveProps(nextProps: Props) {
    this.setState(
      valueToState(nextProps.value, this.props.units!, this.state.unit)
    );
  }

  private handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (this.props.onChange) {
      const newState: State = {
        ...this.state,
        value: e.target.value,
      };
      // Assume we have a controlled component and propage the value up,
      // it then should come back in the props.
      this.props.onChange(stateToValue(newState));
    }
  };

  private handleUnitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    // First set new unit before propagting new value.
    this.setState(
      {
        unit: parseInt(e.target.value, 10),
      },
      () => {
        if (this.props.onChange) {
          this.props.onChange(stateToValue(this.state));
        }
      }
    );
  };

  public render() {
    const { disabled, name } = this.props;
    return (
      <Flex itemGutter>
        <TextField
          className={styles.value}
          name={`${name}-value`}
          onChange={this.handleValueChange}
          value={this.state.value}
          disabled={disabled}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          textAlignCenter
          aria-label="value"
        />
        <SelectField
          name={`${name}-unit`}
          onChange={this.handleUnitChange}
          disabled={disabled}
          aria-label="unit"
          classes={{
            select: styles.unit,
          }}
          value={(this.state.unit || this.state.units[0]).toString()}
        >
          {this.state.elementCallbacks!.map((cb, i) =>
            cb(parseInt(this.state.value, 10), this.state.units[i].toString())
          )}
        </SelectField>
      </Flex>
    );
  }
}

export default DurationField;
