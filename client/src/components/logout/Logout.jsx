import { useState } from "react";

import { instanceOf } from "prop-types";
import { Cookies, withCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import { logout } from "../../utils/auth/authUtils";

// import { clearCookies } from "../../utils/auth/cookie";

const Logout = ({ cookies }) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState();

  const handleLogout = async () => {
    try {
      await logout("/login", navigate, cookies);
      navigate("/signup");
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div>
      {errorMessage && <p>{errorMessage}</p>}
      <button
        type="submit"
        style={{ color: "white" }}
        onClick={handleLogout}
      >
        Log out
      </button>
    </div>
  );
};

Logout.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};

const L = withCookies(Logout);
export { L };
