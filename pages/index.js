import React, { PureComponent } from 'react';
import moment from 'moment';

const date = moment(new Date('2019-03-03 00:00'));

export default class App extends PureComponent {
  state = {};

  componentDidMount() {
    this.interval = setInterval(() => {
      const duration = moment.duration(date.diff());

      const days = duration.get('days');
      const hours = duration.get('hours');
      const minutes = duration.get('minutes');
      const seconds = duration.get('seconds');
      this.setState({ days, hours, minutes, seconds });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { days, hours, minutes, seconds } = this.state;

    return (
      <>
        <link rel="stylesheet" href="/static/styles.css" />
        <div className="root">
          <h1>
            Our Website is <b>Coming Soon</b>, follow us for updates now!
          </h1>
          <form action="https://formspree.io/info@rooflint.com" method="POST">
            <input
              name="email"
              type="email"
              required
              placeholder="Email Address"
            />
            <button type="submit">Subscribe</button>
          </form>
          {days && (
            <div className="time">
              <div className="time-unit">
                <span>{days}</span> Days
              </div>
              <div className="time-unit">
                <span>{hours}</span> Hours
              </div>
              <div className="time-unit">
                <span>{minutes}</span> Minutes
              </div>
              <div className="time-unit">
                <span>{seconds}</span> Seconds
              </div>
            </div>
          )}
          <footer>
            <ul className="social-links">
              <li>
                <a
                  title="Facebook"
                  href="https://www.facebook.com/Rooflint-2236850606338964/"
                >
                  <img
                    role="presentation"
                    alt={undefined}
                    src="/static/facebook.png"
                  />
                </a>
              </li>
              <li>
                <a
                  title="YouTube"
                  href="https://www.youtube.com/channel/UCRoXY03hZd5PgdyHJk4N4tQ"
                >
                  <img
                    role="presentation"
                    alt={undefined}
                    src="/static/youtube.png"
                  />
                </a>
              </li>
            </ul>
          </footer>
        </div>
      </>
    );
  }
}
