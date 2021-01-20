import { Link } from 'react-scroll'

import Prometheus from '../../resources/prometheus.png';
import Logo from '../../resources/logo-flame.png';
import './header.styles.scss';

const Header = () => (
    <div>
        <div className="top-navbar">
            <div className="logo">
                <img src={Logo} alt=""/>
            </div>
            <div className="github_link">
                <a href="https://github.com/arian42/project_prometheus" target="blank">
                    <span className="icon-github"></span>
                </a>
            </div>
        </div>
        <div className="header-content">
            <div className="title">
                <h1>Prometheus<br/>Messenger</h1>
                <p>The hottest messenger you have ever seen</p>
                <Link 
                    className="cta"
                    to="scrollhere"
                    spy={true}
                    smooth={true}
                    offset={10}
                    duration={700}
                >Start Messaging</Link>
            </div>
            <div className="img">
                <img src={Prometheus} alt=""/>
            </div>
        </div>
    </div>
)

export default Header;