import React, { Component } from "react";
import styles from "./classcomponent.module.css";

class PersonalDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      brand: "Ford",
      model: "Mustang",
      isMale: 1969,
    };
  }

  render() {
    return (
      <div className={styles.classcomponents}>
        <h2>This works based on using Class Components</h2>
        <h3>My car name is {this.state.brand}</h3>
        <h3>It is {this.state.model}</h3>
        <h3>And made in {this.state.isMale}</h3>
        <NewDetail />
      </div>
    );
  }
}

class NewDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMale: null,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ isMale: 1974 });
    }, 1000);
  }

  render() {
    return null;
  }
}

class ClassComponent extends React.Component {
  render() {
    return (
      <div className={styles.car}>
        <h1>What is your car details?</h1>
        <PersonalDetails />
      </div>
    );
  }
}

export default ClassComponent;
