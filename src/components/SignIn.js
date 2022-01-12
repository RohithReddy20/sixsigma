import { React, useState } from "react";
import "./Sign.css";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function SignIn() {
  //const history = useHistory();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  //remove "go-to-main-website-on scroll"
  window.onscroll = function () {
    if (window.scrollY < 150) {
      document.getElementsByClassName("main-website")[0].style.top = "5%";
    } else {
      document.getElementsByClassName("main-website")[0].style.top = "-5%";
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      await login(email, password);
      navigate("/");
    } catch (error) {
      //check for part of string in sentence
      console.log("Failed to login  " + error);
    }
    setLoading(false);
  }
  return (
    <div className="sign-in">
      <div className="top">
        <Link className="main-website" to="/">
          Go to main website
        </Link>
        <div className="logo">
          <img src="./images/company-logo.png" alt="logo" />
        </div>
      </div>

      <div className="txt">
        <h2>Login or Sign up to Crown Reality Portal</h2>
        {/* <h1>{currentUser && currentUser.email}</h1>
        {currentUser && <button onClick={() => logout()}>Sign out</button>} */}
      </div>
      <div className="form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="yourname@work-email.com"
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Password"
              autoComplete="on"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
          </div>

          <button disabled={loading} type="submit" className="btn btn-primary">
            Continue
          </button>
          <div className="passwordReset">
            <Link to="/reset-password">Forgot password?</Link>
            <Link style={{ color: "#ff0000", fontWeight: "bold" }} to="/signup">
              {" "}
              New User
            </Link>
          </div>
        </form>
      </div>
      <div className="spt">
        <h2>OR</h2>
      </div>
      <div className="GoAp">
        <button
          disabled={loading}
          type="submit"
          className="btn btn-primary"
          onClick={signInWithGoogle}
        >
          <span>
            <img src="./images/IconGoogle.svg" alt="Google" />
          </span>
          Continue with Google
        </button>
        <button disabled={loading} className="btn btn-primary">
          <span>
            <img src="./images/IconApple.svg" alt="Apple" />
          </span>
          Continue with Apple
        </button>
      </div>
      <div className="footer">
        <footer>
          <p>Powered By</p>
          <p>Alpha</p>
          <p>Six Sigma Digital Inc.</p>
        </footer>
      </div>
    </div>
  );
}

export default SignIn;
