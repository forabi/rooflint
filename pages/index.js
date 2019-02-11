import Head from 'next/head';
import React, { PureComponent } from 'react';
import moment from 'moment';
import MaskedInput from 'react-text-mask';
import Modal from 'react-aria-modal';
import './styles.css';

const date = moment(new Date('2019-03-03 00:00'));
const mask = [
  '+',
  /[1-9]/,
  /\d/,
  /\d/,
  ' ',
  /\d/,
  /\d/,
  /\d/,
  ' ',
  /\d/,
  /\d/,
  /\d/,
  ' ',
  /\d/,
  /\d/,
  /\d/
];

export default class App extends PureComponent {
  state = { isDialogOpen: false };

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

  toggleDialog = () => {
    this.setState(state => ({ isDialogOpen: !state.isDialogOpen }));
  };

  render() {
    const { days, hours, minutes, seconds } = this.state;

    return (
      <>
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <div className="root">
          <h1>
            Our Website is <b>Coming Soon</b>, follow us for updates now!
          </h1>
          <button className="open-dialog" onClick={this.toggleDialog}>
            Notify Me When You Launch
          </button>
          <Modal
            underlayClass="dialog-underlay"
            dialogClass="dialog"
            titleText="notify"
            mounted={this.state.isDialogOpen}
            escapeExits
            underlayClickExits
            onExit={this.toggleDialog}
          >
            <form
              autoComplete="on"
              action="https://formspree.io/info@rooflint.com"
              method="POST"
            >
              <h2>We'll notify you when we launch</h2>
              <input
                autoComplete="name"
                name="name"
                type="text"
                required
                placeholder="Name"
              />
              <input
                autoComplete="email"
                name="email"
                type="email"
                required
                placeholder="Email Address"
              />
              <MaskedInput
                autoComplete="tel"
                required
                placeholder="Phone Number"
                name="phone"
                type="tel"
                mask={mask}
              />
              <input
                autoComplete="street-address"
                name="address"
                type="text"
                placeholder="Address"
              />
              <textarea
                rows={4}
                name="comments"
                placeholder="Any comments you'd like to leave?"
              />
              <button type="submit">Subscribe</button>
            </form>
          </Modal>
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
