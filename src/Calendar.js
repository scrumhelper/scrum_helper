import React from "react";
// import ApiCalendar from "react-google-calendar-api";
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
        theme={{
          selectionColor: dateStr => {
            let date = new Date(dateStr);
            console.log(date)
            console.log(date.getDate())

            let index = -1;
            for(let i = this.props.dates.length - 1; i >= 0; i--) {
              if (this.props.dates[i].getDate() === date.getDate() + 1) index = i;
            }

            if (index === 0) return "#0000cc";
            if (index === 1) return "#cc0000";
            if (index === 2) return "#00cc00";
            return "rgba(0, 0, 0, 0)";
          }
        }}
        onSelect={selectedDate =>
          defaultMultipleDateInterpolation(selectedDate, this.props.dates)
        }
        selected={this.props.dates}
        scrollDate={new Date()}
      />
    );
  }
}
