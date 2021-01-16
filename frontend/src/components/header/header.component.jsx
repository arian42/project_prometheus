import prometheus from '../../../src/resource/prometheus.png';
import logo from '../../../src/resource/logo-flame.png';
import './header.styles.scss';

const Header = () => (
    <div>
        <div className="top-navbar">
            <div className="logo">
                <img src={logo} alt=""/>
            </div>
            <div className="link">
                <a href="https://github.com/arian42/project_prometheus">Github</a>
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