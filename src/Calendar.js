import React from "react";
import ApiCalendar from "react-google-calendar-api";
import InfiniteCalendar, {
  Calendar as CalendarDefault,
  defaultMultipleDateInterpolation,
  withMultipleDates,
  isBefore
} from "react-infinite-calendar";
import { withDefaultProps } from "react-infinite-calendar/lib/Calendar";
import "react-infinite-calendar/styles.css";

const ReadOnlyCalendar = withDefaultProps(withMultipleDates(CalendarDefault));

export default class Calendar extends React.Component {
  render() {
    return (
      <ReadOnlyCalendar
        displayOptions={{
          showHeader: false
        }}
        onSelect={selectedDate =>
          defaultMultipleDateInterpolation(selectedDate, this.state.dates)
        }
        selected={this.props.dates}
        scrollDate={new Date()}
      />
    );
  }
}
