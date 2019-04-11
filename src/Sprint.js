import React from "react";
import { Link, Switch, Route } from "react-router-dom";

class Sprint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sprint: this.newSprint()
    };
  }

  newSprint() {
    return {
      id: null,
    };
  }

  componentDidUpdate() {
    const newID = this.props.match.params.sid || null;
    const oldID = this.state.sprint.id || null;
    if (newID !== oldID) {
      if (oldID !== null) this.props.functions.save.sprint(this.state.sprint);
      if (newID === null)
        this.setState({
          sprint: this.newSprint()
        });
      else
        this.setState({
          sprint: this.props.sprints.find(s => s.id === newID)
        });
    }
  }

  render() {
    return (
      <div>
        <h1>Sprints</h1>

        {this.state.sprint.id === null && (
          <div>
            Start a sprint!
            <form
              onSubmit={event => {
                event.preventDefault();
                this.props.createSprint();
              }}
            >

              <button>create</button>
            </form>
          </div>
        )}
      </div>
    );
  }
}

export default Sprint;
