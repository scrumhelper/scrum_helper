import React from "react";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Checkbox from "@material-ui/core/Checkbox";
import Avatar from "@material-ui/core/Avatar";

import FindUser from "./FindUser";

class UserList extends React.Component {
  state = {
    checked: []
  };

  handleToggle = id => {
    const currentIndex = this.state.checked.indexOf(id);
    const newChecked = [...this.state.checked];

    if (currentIndex === -1) {
      newChecked.push(id);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.props.updateChecked(newChecked);

    this.setState({ checked: newChecked });
  };

  render() {
    let list = [];
    if (this.props.uids != undefined)
      list = this.props.users.filter(u =>
        this.props.uids.find(id => id === u.id)
      );
    if (list.length === 0) list = this.props.users;

    return (
      <div>
        <List>
          {list.map((u, index) => (
            <ListItem key={index} button>
              <ListItemAvatar>
                <Avatar alt={`Avatar`} src={u.photo} />
              </ListItemAvatar>
              <ListItemText primary={u.name} />
              {this.props.checkable && (
                <ListItemSecondaryAction>
                  <Checkbox
                    onChange={() => this.handleToggle(u.id)}
                    checked={this.state.checked.indexOf(u.id) !== -1}
                  />
                </ListItemSecondaryAction>
              )}
            </ListItem>
          ))}
        </List>
      </div>
    );
  }
}

export default UserList;
