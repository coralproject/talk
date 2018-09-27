import { Router, withRouter } from "found";
import React, { Component } from "react";
import Navigation from "../components/Navigation";

interface NavigationContainerProps {
  router: Router;
}

class NavigationContainer extends Component<NavigationContainerProps> {
  private goToModerate = () => this.props.router.replace("/admin/moderate");
  private goToCommunity = () => this.props.router.replace("/admin/community");
  private goToStories = () => this.props.router.replace("/admin/stories");
  private goToConfigure = () => this.props.router.replace("/admin/configures");
  public render() {
    return (
      <Navigation
        goToModerate={this.goToModerate}
        goToCommunity={this.goToCommunity}
        goToStories={this.goToStories}
        goToConfigure={this.goToConfigure}
      />
    );
  }
}

export default withRouter(NavigationContainer);
