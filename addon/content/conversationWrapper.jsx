/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/* globals ConversationHeader, ConversationFooter, MessageList,
           React, ReactRedux, PropTypes, messageActions */
/* exported ConversationWrapper */

class _ConversationWrapper extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this._setHTMLAttributes();

    // When moving to a WebExtension page this can simply be moved to CSS (see
    // options.css).
    document.documentElement.setAttribute(
      "dir",
      browser.conversations.getLocaleDirection()
    );

    this.props.dispatch(messageActions.waitForStartup());
  }

  componentDidUpdate(prevProps) {
    this._setHTMLAttributes(prevProps);
  }

  _setHTMLAttributes(prevProps) {
    if (
      prevProps &&
      this.props.OS == prevProps.OS &&
      this.props.tweakChrome == prevProps.tweakChrome
    ) {
      return;
    }

    const html = document.body.parentNode;
    if (this.props.tweakChrome && this.props.OS) {
      html.setAttribute("os", this.props.OS);
    } else {
      html.removeAttribute("os");
    }
  }

  render() {
    return (
      <div>
        <div className="hidden" id="tooltipContainer"></div>
        <ConversationHeader />
        <MessageList />
        <ConversationFooter />
      </div>
    );
  }
}

_ConversationWrapper.propTypes = {
  dispatch: PropTypes.func.isRequired,
  tweakChrome: PropTypes.bool.isRequired,
  OS: PropTypes.string,
};

const ConversationWrapper = ReactRedux.connect((state) => {
  return {
    tweakChrome: !!state.summary.prefs && state.summary.prefs.tweakChrome,
    OS: state.summary.OS,
  };
})(_ConversationWrapper);
