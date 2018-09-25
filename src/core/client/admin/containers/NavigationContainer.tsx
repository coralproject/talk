import React, { Component } from "react";
import Navigation from "../components/Navigation";
import { SetViewMutation, withSetViewMutation } from "../mutations";

interface NavigationContainerProps {
  setView: SetViewMutation;
}

class NavigationContainer extends Component<NavigationContainerProps> {
  private goToModerate = () => this.props.setView({ view: "MODERATE" });
  private goToCommunity = () => this.props.setView({ view: "COMMUNITY" });
  private goToStories = () => this.props.setView({ view: "STORIES" });
  private goToConfigure = () => this.props.setView({ view: "CONFIGURE" });
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

export default withSetViewMutation(NavigationContainer);
