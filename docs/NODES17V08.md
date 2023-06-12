# VIDEO 08 - Login integrando back y front

En este vídeo hemos hecho nuestro componente de Login:

```jsx
import { FormEvent, useContext, useRef } from "react";
import Header from "../../components/Header/Header";
import "./LoginPage.scss";
import { AuthContext } from "../../App";

interface LoginInfo {
  email: string;
  password: string;
}

const LoginPage = (): JSX.Element => {
  const authInfo = useContext(AuthContext);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const submitForm = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const loginInfo: LoginInfo = {
      email: emailRef?.current?.value as string,
      password: passwordRef?.current?.value as string,
    };

    if (!loginInfo.email || !loginInfo.password) {
      alert("Email y la contraseña son obligatorios!");
    } else {
      doLoginRequest(loginInfo);
    }
  };

  const doLoginRequest = (loginInfo: LoginInfo): void => {
    fetch("http://localhost:3000/user/login", {
      method: "POST",
      body: JSON.stringify(loginInfo),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(async (response) => {
        if (response.status !== 200) {
          alert("Login incorrecto");
        }
        return await response.json();
      })
      .then((data) => {
        // Login OK -> Guardamos las credenciales
        if (data.token && data.user && authInfo.login) {
          authInfo.login(data.token, data.user);
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Ha ocurrido un error en la petición");
      });
  };

  return (
    <div className="login-page page">
      <Header></Header>

      <h1>LoginPage!</h1>

      <form onSubmit={submitForm} className="login-page__form">
        <label htmlFor="email">Email:</label>
        <input ref={emailRef} type="text" id="email" />

        <label htmlFor="password">Password:</label>
        <input ref={passwordRef} type="text" id="password" />

        <input type="submit" title="Log in" />
      </form>
    </div>
  );
};

export default LoginPage;
```

Y hemos hecho que la info del usuario logado se muestre en la cabecera:

```jsx
import { useContext } from "react";
import "./Header.scss";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../App";

const Header = (): JSX.Element => {
  const authInfo = useContext(AuthContext);

  return (
    <header className="header">
      <NavLink to="/" className="header__link">
        Home
      </NavLink>
      <NavLink to="/classroom" className="header__link">
        Classroom
      </NavLink>
      <NavLink to="/subject" className="header__link">
        Subject
      </NavLink>
      <NavLink to="/user" className="header__link">
        User
      </NavLink>

      <div className="header__user-info">
        {authInfo?.userInfo ? (
          <>
            <span className="header__name"> Hola {authInfo.userInfo.firstName},</span>
            <span className="header__logout" onClick={authInfo.logout}>
              salir
            </span>
          </>
        ) : (
          <NavLink to="/login" className="header__link">
            Login
          </NavLink>
        )}
      </div>
    </header>
  );
};

export default Header;
```

