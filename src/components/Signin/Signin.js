import React, { Component } from "react";

class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signInEmail: "",
      signInPassword: ""
    };
  }

  onEmailChange = event => {
    this.setState({ signInEmail: event.target.value });
  };

  onPasswordChange = event => {
    this.setState({ signInPassword: event.target.value });
  };

  saveAuthTokenInSession = token => {
    //keep the key value even if another page is open
    //window.localStorage.setItem("token", token);
    //single and recomendate session, only for the actual page
    window.sessionStorage.setItem("token", token);
  };

  onSubmitSignIn = () => {
    fetch("http://localhost:3000/signin", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: this.state.signInEmail,
        password: this.state.signInPassword
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.userId && data.success === "true") {
          this.saveAuthTokenInSession(data.token);
          // this.props.loadUser(data);
          // this.props.onRouteChange("home");
          fetch(`http://localhost:3000/profile/${data.userId}`, {
            method: "get",
            headers: {
              "Content-Type": "application/json",
              Authorization: data.token
            }
          })
            .then(resp => resp.json())
            .then(user => {
              if (user && user.email) {
                this.props.loadUser(user);
                this.props.onRouteChange("home");
              }
            });
        }
      })
      .catch(err => console.log(err));
  };

  render() {
    const { onRouteChange } = this.props;
    return (
      <article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <article className="pa4 black-80">
          <div>
            <fieldset id="sign_in" className="ba b--transparent ph0 mh0">
              <legend className="f2 ph0 mh0 fw6">Sign In</legend>
              <div className="mt3">
                <label className="db fw4 lh-copy f6" htmlFor="email-address">
                  Email address
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent w-100 measure"
                  type="email"
                  name="email-address"
                  id="email-address"
                  onChange={this.onEmailChange}
                />
              </div>
              <div className="mt3">
                <label className="db fw4 lh-copy f6" htmlFor="password">
                  Password
                </label>
                <input
                  className="b pa2 input-reset ba bg-transparent"
                  type="password"
                  name="password"
                  id="password"
                  onChange={this.onPasswordChange}
                />
              </div>
            </fieldset>
            <div className="mt3">
              <input
                onClick={this.onSubmitSignIn}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6"
                type="submit"
                value="Sign In"
              />
            </div>
            <div className="lh-copy mt3">
              <p
                onClick={() => onRouteChange("register")}
                className="f6 link dim black db pointer"
              >
                Register
              </p>
            </div>
          </div>
        </article>
      </article>
    );
  }
}

export default Signin;
