import React, { Component } from "react";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import Particles from "react-particles-js";
import Modal from "./components/Modal/Modal";
import Profile from "./components/Profile/Profile";
import "./App.css";

//TODOs
//Profile: add age and hobby
//implement token flow for /register
//add sign out to revoke the token
//refactor the fetch() functions
//implement auth with Bearer. Authorization : Bearer cn389ncoiwuencr
//change cDMount() to gDSFProps() and see if "err" is not printed

const particlesOption = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
};

const initialState = {
  input: "",
  imageUrl: "",
  box: [],
  route: "signin",
  isSignedIn: false,
  isProfileOpen: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
    hobby: "",
    age: ""
  }
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }
  //TODO change to getderivedstatesfromprops
  componentDidMount() {
    const token = window.sessionStorage.getItem("token");
    if (token) {
      fetch("http://localhost:3000/signin", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        }
      })
        .then(resp => resp.json())
        .then(data => {
          if (data && data.id) {
            fetch(`http://localhost:3000/profile/${data.id}`, {
              method: "get",
              headers: {
                "Content-Type": "application/json",
                Authorization: token
              }
            })
              .then(resp => resp.json())
              .then(user => {
                if (user && user.email) {
                  this.loadUser(user);
                  this.onRouteChange("home");
                }
              });
          }
        })
        .catch(console.log("err"));
    }
  }

  loadUser = data => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    });
  };

  calculateFaceLocation = data => {
    if (data && data.outputs) {
      const image = document.getElementById("inputimage");
      const width = Number(image.width);
      const height = Number(image.height);
      return data.outputs[0].data.regions.map(region => {
        return {
          leftCol: region.region_info.bounding_box.left_col * width,
          topRow: region.region_info.bounding_box.top_row * height,
          rightCol: width - region.region_info.bounding_box.right_col * width,
          bottomRow:
            height - region.region_info.bounding_box.bottom_row * height
        };
      });
    }
    return;
  };

  displayFaceBox = box => {
    //TODO use default parameters
    if (box) {
      this.setState({ box: box });
    }
  };

  onInputChange = event => {
    this.setState({ input: event.target.value });
  };

  onPictureSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    fetch("http://localhost:3000/imageUrl", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: window.sessionStorage.getItem("token")
      },
      body: JSON.stringify({
        input: this.state.input
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch("http://localhost:3000/image", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: window.sessionStorage.getItem("token")
            },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }));
            })
            .catch(console.log);
        }
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch(err => console.log(err));
  };

  onRouteChange = route => {
    if (route === "signout") {
      return this.setState(initialState);
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  toogleModal = () => {
    this.setState(prevState => ({
      ...prevState,
      isProfileOpen: !prevState.isProfileOpen
    }));
  };

  render() {
    const {
      imageUrl,
      box,
      isSignedIn,
      route,
      isProfileOpen,
      user
    } = this.state;
    return (
      <div className="App">
        <Particles params={particlesOption} className="particles" />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
          toogleModal={this.toogleModal}
        />
        {isProfileOpen && (
          <Modal>
            <Profile
              isProfileOpen={isProfileOpen}
              toogleModal={this.toogleModal}
              loadUser={this.loadUser}
              user={user}
            />
          </Modal>
        )}
        {route === "home" ? (
          <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onPictureSubmit={this.onPictureSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
        ) : this.state.route === "signin" ? (
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          //"signout" vem pra Register
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    );
  }
}

export default App;
