import React, {useState} from 'react'
import '../Sign.css'
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
    const { forgotPassword } = useAuth();
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    function handleRSubmit(e) {
        e.preventDefault();
        if(email){
            forgotPassword(email);
            navigate('/signin');
        }
    }
    return (
        <div className="reset-password">
            <div className="form">
        <form onSubmit={handleRSubmit} >
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              //onChange={onEmailChange}
              aria-describedby="emailHelp"
              placeholder="yourname@work-email.com"
              onChange={(event) => {
                  setEmail(event.target.value);
                }}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Send
          </button>
        </form>
      </div>
        </div>
    )
}

export default ResetPassword;
