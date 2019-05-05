import React from "react";
import { Button } from "semantic-ui-react";

export default class BuckSetListItem extends React.Component {
  render() {
    const { title, subtitle } = this.props.data;

    return (
      <div class="ui fluid card">
        <div class="content">
          <a class="header">{title}</a>
          <div class="meta">
            <span class="date">{subtitle}</span>
          </div>
        </div>
        <div class="extra content">
          <button class="ui button">Preview</button>
          <button class="ui button">Edit</button>
          <a>
            <i class="trash alternate icon" />
          </a>
        </div>
      </div>
    );
  }
}
