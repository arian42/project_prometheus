import prometheus from '../../../src/resource/prometheus.png';
import logo from '../../../src/resource/logo-flame.png';
import './header.styles.scss';

const Header = () => (
    <div>
        <div className="top-navbar">
            <a className="logo"  href="#">
                <img src={logo} alt=""/>
            </a>
            <div className="link">
                <a href="#"><span className="icon-icon_github"></span></a>
            </div>
        </div>
        <div className="header-content">
            <div className="title">
                <h1>Prometheus<br></br>Messenger</h1>
                <p>The hottest messenger you have ever seen</p>
                <a className="cta" href="#">Start Messaging</a>
            </div>
            <div className="img">
                <img src={prometheus} alt=""/>
            </div>
        </div>
    </div>
)

export default Header;