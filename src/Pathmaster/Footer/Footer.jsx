import React, { Component } from "react";

import "./Footer.css";

export default class Footer extends Component {
  render() {
    return (
      <div onMouseUp={() => this.props.handleMouseUp()}>
        <div className="footer">
          Made with <span class="heart">❤</span> in DefHacks 2020
        </div>
      </div>
    );
  }
}
