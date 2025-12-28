import { Link } from 'react-router-dom';

function NotFoundPage(): JSX.Element {
  return (
    <div className="page">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Link className="header__logo-link" to="/">
                <img className="header__logo" src="img/logo.svg" alt="6 cities logo" width="81" height="41" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="page__main page__main--404">
        <div className="container" style={{textAlign: 'center', padding: '100px 20px'}}>
          <h1 style={{fontSize: '48px', marginBottom: '20px'}}>404</h1>
          <p style={{fontSize: '24px', marginBottom: '40px'}}>Page Not Found</p>
          <Link to="/" style={{color: '#4481c3', textDecoration: 'underline'}}>Return to home page</Link>
        </div>
      </main>
    </div>
  );
}

export default NotFoundPage;

