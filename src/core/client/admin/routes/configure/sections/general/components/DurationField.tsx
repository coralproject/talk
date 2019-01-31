import { Localized } from "fluent-react/compat";
import React, { ChangeEvent, Component } from "react";

import { Flex, Option, SelectField, TextField } from "talk-ui/components";

import styles from "./DurationField.css";

interface Props {
  name: string;
  value: number;
  disabled: boolean;
  onChange: (v: number) => void;
}

interface State {
  value?: number;
  unit?: number;
}

const SECONDS_IN_AN_HOUR = 3600;
const SECONDS_IN_A_DAY = 86400;
const SECONDS_IN_A_WEEK = 604800;

function valueToState(value: number, unit?: number) {
  if (!unit) {
    unit = SECONDS_IN_AN_HOUR;
    if (value > 0) {
      if (value % SECONDS_IN_A_WEEK === 0) {
        unit = SECONDS_IN_A_WEEK;
      } else if (value % SECONDS_IN_A_DAY === 0) {
        unit = SECONDS_IN_A_DAY;
      }
    }
  }
  return { unit, value: value / unit };
}

function stateToValue(state: State) {
  return state.value! * state.unit!;
}

class DurationField extends Component<Props, State> {
  public state: State = this.props.value ? valueToState(this.props.value) : {};
  public componentWillReceiveProps(nextProps: Props) {
    this.setState(valueToState(nextProps.value, this.state.unit));
  }
  private handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newState: State = {
      ...this.state,
      value: !e.target.value ? 0 : parseInt(e.target.value, 10),
    };
    if (this.props.onChange) {
      this.props.onChange(stateToValue(newState));
    }
  };
  private handleUnitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newState: State = {
      ...this.state,
      unit: parseInt(e.target.value, 10),
    };
    this.setState(newState, () => {
      if (this.props.onChange) {
        this.props.onChange(stateToValue(newState));
      }
    });
  };

  public render() {
    const { disabled, name } = this.props;
    return (
      <Flex itemGutter>
        <TextField
          className={styles.value}
          name={`${name}-value`}
          onChange={this.handleValueChange}
          value={this.state.value ? this.state.value.toString() : ""}
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
          value={
            this.state.unit
              ? this.state.unit.toString()
              : SECONDS_IN_AN_HOUR.toString()
          }
        >
          <Localized
            id="configure-general-durationField-hours"
            $value={this.state.value}
          >
            <Option value={SECONDS_IN_AN_HOUR.toString()}>Hours</Option>
          </Localized>
          <Localized
            id="configure-general-durationField-days"
            $value={this.state.value}
          >
            <Option value={SECONDS_IN_A_DAY.toString()}>Days</Option>
          </Localized>
          <Localized
            id="configure-general-durationField-weeks"
            $value={this.state.value}
          >
            <Option value={SECONDS_IN_A_WEEK.toString()}>Weeks</Option>
          </Localized>
        </SelectField>
      </Flex>
    );
  }
}

export default DurationField;
