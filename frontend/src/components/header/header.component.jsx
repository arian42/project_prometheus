import prometheus from '../../../src/resource/prometheus.png';
import logo from '../../../src/resource/logo-flame.png';
import './header.styles.scss';

const Header = () => (
    <div>
        <div className="top-navbar">
            <a href="#" className="logo">
                <img src={logo} alt=""/>
            </a>
            <div className="github_link">
                <a href="https://github.com/arian42/project_prometheus">
                    <span className="icon-icon_github"></span>
                </a>
            </div>
        </div>
        <div className="header-content">
            <div className="title">
                <h1>Prometheus<br></br>Messenger</h1>
                <p>The hottest messenger you have ever seen</p>
                <button className="cta" >Start Messaging</button>
            </div>
            <div className="img">
                <img src={prometheus} alt=""/>
            </div>
        </div>
    </div>
)

export default Header;