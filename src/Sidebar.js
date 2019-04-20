import React from "react";
import { Link } from "react-router-dom";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { Menu } from "@material-ui/icons";
import { ChevronLeft, Home } from "@material-ui/icons/";
import IconButton from "@material-ui/core/IconButton";
import ListItemText from "@material-ui/core/ListItemText";

const Sidebar = ({ workspaces, close }) => {
  return (
    <div className="Sidebar">
      <List style={{ width: "auto" }}>
        <ListItem>
          <IconButton onClick={close}>
            <ChevronLeft />
          </IconButton>
        </ListItem>
        <Divider />
        <Link to={`/workspace`}>
          <ListItem>
            <Home />
            <ListItemText primary={"Home"} />
          </ListItem>
        </Link>
        <Divider />
        <ListItem>
          <ListItemText primary="Workspaces" />
        </ListItem>
        {workspaces
          .sort((a, b) => (a.name > b.name ? 1 : b.name < a.name ? -1 : 0))
          .map((workspace, index) => (
            <Link to={`/workspace/${workspace.id}`} key={index}>
              <ListItem button key={workspace.id}>
                <ListItemText primary={workspace.name} />
              </ListItem>
            </Link>
          ))}
      </List>
    </div>
  );
};

export default Sidebar;
