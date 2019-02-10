webpackHotUpdate("static/development/pages/index.js",{

/***/ "./node_modules/focus-trap-react/dist/focus-trap-react.js":
/*!****************************************************************!*\
  !*** ./node_modules/focus-trap-react/dist/focus-trap-react.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var createFocusTrap = __webpack_require__(/*! focus-trap */ "./node_modules/focus-trap/index.js");

var checkedProps = ['active', 'paused', 'tag', 'focusTrapOptions', '_createFocusTrap'];

var FocusTrap = function (_React$Component) {
  _inherits(FocusTrap, _React$Component);

  function FocusTrap(props) {
    _classCallCheck(this, FocusTrap);

    var _this = _possibleConstructorReturn(this, (FocusTrap.__proto__ || Object.getPrototypeOf(FocusTrap)).call(this, props));

    _this.setNode = function (el) {
      _this.node = el;
    };

    if (typeof document !== 'undefined') {
      _this.previouslyFocusedElement = document.activeElement;
    }
    return _this;
  }

  _createClass(FocusTrap, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      // We need to hijack the returnFocusOnDeactivate option,
      // because React can move focus into the element before we arrived at
      // this lifecycle hook (e.g. with autoFocus inputs). So the component
      // captures the previouslyFocusedElement in componentWillMount,
      // then (optionally) returns focus to it in componentWillUnmount.
      var specifiedFocusTrapOptions = this.props.focusTrapOptions;
      var tailoredFocusTrapOptions = {
        returnFocusOnDeactivate: false
      };
      for (var optionName in specifiedFocusTrapOptions) {
        if (!specifiedFocusTrapOptions.hasOwnProperty(optionName)) continue;
        if (optionName === 'returnFocusOnDeactivate') continue;
        tailoredFocusTrapOptions[optionName] = specifiedFocusTrapOptions[optionName];
      }

      this.focusTrap = this.props._createFocusTrap(this.node, tailoredFocusTrapOptions);
      if (this.props.active) {
        this.focusTrap.activate();
      }
      if (this.props.paused) {
        this.focusTrap.pause();
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      if (prevProps.active && !this.props.active) {
        var returnFocusOnDeactivate = this.props.focusTrapOptions.returnFocusOnDeactivate;

        var returnFocus = returnFocusOnDeactivate || false;
        var config = { returnFocus: returnFocus };
        this.focusTrap.deactivate(config);
      } else if (!prevProps.active && this.props.active) {
        this.focusTrap.activate();
      }

      if (prevProps.paused && !this.props.paused) {
        this.focusTrap.unpause();
      } else if (!prevProps.paused && this.props.paused) {
        this.focusTrap.pause();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.focusTrap.deactivate();
      if (this.props.focusTrapOptions.returnFocusOnDeactivate !== false && this.previouslyFocusedElement && this.previouslyFocusedElement.focus) {
        this.previouslyFocusedElement.focus();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var elementProps = {
        ref: this.setNode
      };

      // This will get id, className, style, etc. -- arbitrary element props
      for (var prop in this.props) {
        if (!this.props.hasOwnProperty(prop)) continue;
        if (checkedProps.indexOf(prop) !== -1) continue;
        elementProps[prop] = this.props[prop];
      }

      return React.createElement(this.props.tag, elementProps, this.props.children);
    }
  }]);

  return FocusTrap;
}(React.Component);

FocusTrap.defaultProps = {
  active: true,
  tag: 'div',
  paused: false,
  focusTrapOptions: {},
  _createFocusTrap: createFocusTrap
};

module.exports = FocusTrap;

/***/ }),

/***/ "./node_modules/focus-trap/index.js":
/*!******************************************!*\
  !*** ./node_modules/focus-trap/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var tabbable = __webpack_require__(/*! tabbable */ "./node_modules/tabbable/index.js");
var xtend = __webpack_require__(/*! xtend */ "./node_modules/xtend/immutable.js");

var listeningFocusTrap = null;

function focusTrap(element, userOptions) {
  var doc = document;
  var container =
    typeof element === 'string' ? doc.querySelector(element) : element;

  var config = xtend(
    {
      returnFocusOnDeactivate: true,
      escapeDeactivates: true
    },
    userOptions
  );

  var state = {
    firstTabbableNode: null,
    lastTabbableNode: null,
    nodeFocusedBeforeActivation: null,
    mostRecentlyFocusedNode: null,
    active: false,
    paused: false
  };

  var trap = {
    activate: activate,
    deactivate: deactivate,
    pause: pause,
    unpause: unpause
  };

  return trap;

  function activate(activateOptions) {
    if (state.active) return;

    updateTabbableNodes();

    state.active = true;
    state.paused = false;
    state.nodeFocusedBeforeActivation = doc.activeElement;

    var onActivate =
      activateOptions && activateOptions.onActivate
        ? activateOptions.onActivate
        : config.onActivate;
    if (onActivate) {
      onActivate();
    }

    addListeners();
    return trap;
  }

  function deactivate(deactivateOptions) {
    if (!state.active) return;

    removeListeners();
    state.active = false;
    state.paused = false;

    var onDeactivate =
      deactivateOptions && deactivateOptions.onDeactivate !== undefined
        ? deactivateOptions.onDeactivate
        : config.onDeactivate;
    if (onDeactivate) {
      onDeactivate();
    }

    var returnFocus =
      deactivateOptions && deactivateOptions.returnFocus !== undefined
        ? deactivateOptions.returnFocus
        : config.returnFocusOnDeactivate;
    if (returnFocus) {
      delay(function() {
        tryFocus(state.nodeFocusedBeforeActivation);
      });
    }

    return trap;
  }

  function pause() {
    if (state.paused || !state.active) return;
    state.paused = true;
    removeListeners();
  }

  function unpause() {
    if (!state.paused || !state.active) return;
    state.paused = false;
    addListeners();
  }

  function addListeners() {
    if (!state.active) return;

    // There can be only one listening focus trap at a time
    if (listeningFocusTrap) {
      listeningFocusTrap.pause();
    }
    listeningFocusTrap = trap;

    updateTabbableNodes();

    // Delay ensures that the focused element doesn't capture the event
    // that caused the focus trap activation.
    delay(function() {
      tryFocus(getInitialFocusNode());
    });
    doc.addEventListener('focusin', checkFocusIn, true);
    doc.addEventListener('mousedown', checkPointerDown, true);
    doc.addEventListener('touchstart', checkPointerDown, true);
    doc.addEventListener('click', checkClick, true);
    doc.addEventListener('keydown', checkKey, true);

    return trap;
  }

  function removeListeners() {
    if (!state.active || listeningFocusTrap !== trap) return;

    doc.removeEventListener('focusin', checkFocusIn, true);
    doc.removeEventListener('mousedown', checkPointerDown, true);
    doc.removeEventListener('touchstart', checkPointerDown, true);
    doc.removeEventListener('click', checkClick, true);
    doc.removeEventListener('keydown', checkKey, true);

    listeningFocusTrap = null;

    return trap;
  }

  function getNodeForOption(optionName) {
    var optionValue = config[optionName];
    var node = optionValue;
    if (!optionValue) {
      return null;
    }
    if (typeof optionValue === 'string') {
      node = doc.querySelector(optionValue);
      if (!node) {
        throw new Error('`' + optionName + '` refers to no known node');
      }
    }
    if (typeof optionValue === 'function') {
      node = optionValue();
      if (!node) {
        throw new Error('`' + optionName + '` did not return a node');
      }
    }
    return node;
  }

  function getInitialFocusNode() {
    var node;
    if (getNodeForOption('initialFocus') !== null) {
      node = getNodeForOption('initialFocus');
    } else if (container.contains(doc.activeElement)) {
      node = doc.activeElement;
    } else {
      node = state.firstTabbableNode || getNodeForOption('fallbackFocus');
    }

    if (!node) {
      throw new Error(
        "You can't have a focus-trap without at least one focusable element"
      );
    }

    return node;
  }

  // This needs to be done on mousedown and touchstart instead of click
  // so that it precedes the focus event.
  function checkPointerDown(e) {
    if (container.contains(e.target)) return;
    if (config.clickOutsideDeactivates) {
      deactivate({
        returnFocus: !tabbable.isFocusable(e.target)
      });
    } else {
      e.preventDefault();
    }
  }

  // In case focus escapes the trap for some strange reason, pull it back in.
  function checkFocusIn(e) {
    // In Firefox when you Tab out of an iframe the Document is briefly focused.
    if (container.contains(e.target) || e.target instanceof Document) {
      return;
    }
    e.stopImmediatePropagation();
    tryFocus(state.mostRecentlyFocusedNode || getInitialFocusNode());
  }

  function checkKey(e) {
    if (config.escapeDeactivates !== false && isEscapeEvent(e)) {
      e.preventDefault();
      deactivate();
      return;
    }
    if (isTabEvent(e)) {
      checkTab(e);
      return;
    }
  }

  // Hijack Tab events on the first and last focusable nodes of the trap,
  // in order to prevent focus from escaping. If it escapes for even a
  // moment it can end up scrolling the page and causing confusion so we
  // kind of need to capture the action at the keydown phase.
  function checkTab(e) {
    updateTabbableNodes();
    if (e.shiftKey && e.target === state.firstTabbableNode) {
      e.preventDefault();
      tryFocus(state.lastTabbableNode);
      return;
    }
    if (!e.shiftKey && e.target === state.lastTabbableNode) {
      e.preventDefault();
      tryFocus(state.firstTabbableNode);
      return;
    }
  }

  function checkClick(e) {
    if (config.clickOutsideDeactivates) return;
    if (container.contains(e.target)) return;
    e.preventDefault();
    e.stopImmediatePropagation();
  }

  function updateTabbableNodes() {
    var tabbableNodes = tabbable(container);
    state.firstTabbableNode = tabbableNodes[0] || getInitialFocusNode();
    state.lastTabbableNode =
      tabbableNodes[tabbableNodes.length - 1] || getInitialFocusNode();
  }

  function tryFocus(node) {
    if (node === doc.activeElement) return;
    if (!node || !node.focus) {
      tryFocus(getInitialFocusNode());
      return;
    }

    node.focus();
    state.mostRecentlyFocusedNode = node;
    if (isSelectableInput(node)) {
      node.select();
    }
  }
}

function isSelectableInput(node) {
  return (
    node.tagName &&
    node.tagName.toLowerCase() === 'input' &&
    typeof node.select === 'function'
  );
}

function isEscapeEvent(e) {
  return e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27;
}

function isTabEvent(e) {
  return e.key === 'Tab' || e.keyCode === 9;
}

function delay(fn) {
  return setTimeout(fn, 0);
}

module.exports = focusTrap;


/***/ }),

/***/ "./node_modules/no-scroll/index.js":
/*!*****************************************!*\
  !*** ./node_modules/no-scroll/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function(root) {
  var isOn = false;
  var scrollbarSize;
  var scrollTop;

  function getScrollbarSize() {
    if (typeof scrollbarSize !== 'undefined') return scrollbarSize;

    var doc = document.documentElement;
    var dummyScroller = document.createElement('div');
    dummyScroller.setAttribute('style', 'width:99px;height:99px;' + 'position:absolute;top:-9999px;overflow:scroll;');
    doc.appendChild(dummyScroller);
    scrollbarSize = dummyScroller.offsetWidth - dummyScroller.clientWidth;
    doc.removeChild(dummyScroller);
    return scrollbarSize;
  }

  function hasScrollbar() {
    return document.documentElement.scrollHeight > window.innerHeight;
  }

  function on(options) {
    if (typeof document === 'undefined' || isOn) return;
    var doc = document.documentElement;
    scrollTop = window.pageYOffset;
    if (hasScrollbar()) {
      doc.style.width = 'calc(100% - '+ getScrollbarSize() +'px)';
    } else {
      doc.style.width = '100%';
    }
    doc.style.position = 'fixed';
    doc.style.top = -scrollTop + 'px';
    doc.style.overflow = 'hidden';
    isOn = true;
  }

  function off() {
    if (typeof document === 'undefined' || !isOn) return;
    var doc = document.documentElement;
    doc.style.width = '';
    doc.style.position = '';
    doc.style.top = '';
    doc.style.overflow = '';
    window.scroll(0, scrollTop);
    isOn = false;
  }

  function toggle() {
    if (isOn) {
      off();
      return;
    }
    on();
  }

  var noScroll = {
    on: on,
    off: off,
    toggle: toggle,
  };

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = noScroll;
  } else {
    root.noScroll = noScroll;
  }
})(this);


/***/ }),

/***/ "./node_modules/react-aria-modal/dist/react-aria-modal.js":
/*!****************************************************************!*\
  !*** ./node_modules/react-aria-modal/dist/react-aria-modal.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var FocusTrap = __webpack_require__(/*! focus-trap-react */ "./node_modules/focus-trap-react/dist/focus-trap-react.js");
var displace = __webpack_require__(/*! react-displace */ "./node_modules/react-displace/dist/displace.js");
var noScroll = __webpack_require__(/*! no-scroll */ "./node_modules/no-scroll/index.js");

var Modal = function (_React$Component) {
  _inherits(Modal, _React$Component);

  function Modal() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Modal);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Modal.__proto__ || Object.getPrototypeOf(Modal)).call.apply(_ref, [this].concat(args))), _this), _this.getApplicationNode = function () {
      if (_this.props.getApplicationNode) return _this.props.getApplicationNode();
      return _this.props.applicationNode;
    }, _this.checkUnderlayClick = function (event) {
      if (_this.dialogNode && _this.dialogNode.contains(event.target)
      // If the click is on the scrollbar we don't want to close the modal.
      || event.pageX > event.target.clientWidth || event.pageY > event.target.clientHeight) return;
      _this.exit();
    }, _this.checkDocumentKeyDown = function (event) {
      if (event.key === 'Escape' || event.key === 'Esc' || event.keyCode === 27) {
        _this.exit();
      }
    }, _this.exit = function () {
      if (_this.props.onExit) {
        _this.props.onExit();
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Modal, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      if (!this.props.titleText && !this.props.titleId) {
        throw new Error('react-aria-modal instances should have a `titleText` or `titleId`');
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var props = this.props;
      if (props.onEnter) {
        props.onEnter();
      }

      // Timeout to ensure this happens *after* focus has moved
      var applicationNode = this.getApplicationNode();
      setTimeout(function () {
        if (applicationNode) {
          applicationNode.setAttribute('aria-hidden', 'true');
        }
      }, 0);

      if (props.escapeExits) {
        document.addEventListener('keydown', this.checkDocumentKeyDown);
      }

      if (this.props.scrollDisabled) {
        noScroll.on();
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      if (prevProps.scrollDisabled && !this.props.scrollDisabled) {
        noScroll.off();
      } else if (!prevProps.scrollDisabled && this.props.scrollDisabled) {
        noScroll.on();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.props.scrollDisabled) {
        noScroll.off();
      }
      var applicationNode = this.getApplicationNode();
      if (applicationNode) {
        applicationNode.setAttribute('aria-hidden', 'false');
      }
      document.removeEventListener('keydown', this.checkDocumentKeyDown);
    }
  }, {
    key: 'render',
    value: function render() {
      var props = this.props;

      var style = {};
      if (props.includeDefaultStyles) {
        style = {
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1050,
          overflowX: 'hidden',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          textAlign: 'center'
        };

        if (props.underlayColor) {
          style.background = props.underlayColor;
        }

        if (props.underlayClickExits) {
          style.cursor = 'pointer';
        }
      }

      if (props.underlayStyle) {
        for (var key in props.underlayStyle) {
          if (!props.underlayStyle.hasOwnProperty(key)) continue;
          style[key] = props.underlayStyle[key];
        }
      }

      var underlayProps = {
        className: props.underlayClass,
        style: style
      };

      if (props.underlayClickExits) {
        underlayProps.onMouseDown = this.checkUnderlayClick;
      }

      for (var prop in this.props.underlayProps) {
        underlayProps[prop] = this.props.underlayProps[prop];
      }

      var verticalCenterStyle = {};
      if (props.includeDefaultStyles) {
        verticalCenterStyle = {
          display: 'inline-block',
          height: '100%',
          verticalAlign: 'middle'
        };
      }

      var verticalCenterHelperProps = {
        key: 'a',
        style: verticalCenterStyle
      };

      var dialogStyle = {};
      if (props.includeDefaultStyles) {
        dialogStyle = {
          display: 'inline-block',
          textAlign: 'left',
          top: 0,
          maxWidth: '100%',
          cursor: 'default',
          outline: props.focusDialog ? 0 : null
        };

        if (props.verticallyCenter) {
          dialogStyle.verticalAlign = 'middle';
          dialogStyle.top = 0;
        }
      }

      if (props.dialogStyle) {
        for (var _key2 in props.dialogStyle) {
          if (!props.dialogStyle.hasOwnProperty(_key2)) continue;
          dialogStyle[_key2] = props.dialogStyle[_key2];
        }
      }

      var dialogProps = {
        key: 'b',
        ref: function (el) {
          this.dialogNode = el;
        }.bind(this),
        role: props.alert ? 'alertdialog' : 'dialog',
        id: props.dialogId,
        className: props.dialogClass,
        style: dialogStyle
      };
      if (props.titleId) {
        dialogProps['aria-labelledby'] = props.titleId;
      } else if (props.titleText) {
        dialogProps['aria-label'] = props.titleText;
      }
      if (props.focusDialog) {
        dialogProps.tabIndex = '-1';
      }

      // Apply data- and aria- attributes passed as props
      for (var _key3 in props) {
        if (/^(data-|aria-)/.test(_key3)) {
          dialogProps[_key3] = props[_key3];
        }
      }

      var childrenArray = [React.createElement('div', dialogProps, props.children)];

      if (props.verticallyCenter) {
        childrenArray.unshift(React.createElement('div', verticalCenterHelperProps));
      }

      var focusTrapOptions = props.focusTrapOptions || {};
      if (props.focusDialog || props.initialFocus) {
        focusTrapOptions.initialFocus = props.focusDialog ? '#' + this.props.dialogId : props.initialFocus;
      }
      focusTrapOptions.escapeDeactivates = props.escapeExits;

      return React.createElement(FocusTrap, {
        focusTrapOptions: focusTrapOptions,
        paused: props.focusTrapPaused
      }, React.createElement('div', underlayProps, childrenArray));
    }
  }]);

  return Modal;
}(React.Component);

Modal.defaultProps = {
  underlayProps: {},
  dialogId: 'react-aria-modal-dialog',
  underlayClickExits: true,
  escapeExits: true,
  underlayColor: 'rgba(0,0,0,0.5)',
  includeDefaultStyles: true,
  focusTrapPaused: false,
  scrollDisabled: true
};


var DisplacedModal = displace(Modal);

DisplacedModal.renderTo = function (input) {
  return displace(Modal, { renderTo: input });
};

module.exports = DisplacedModal;

/***/ }),

/***/ "./node_modules/react-displace/dist/displace.js":
/*!******************************************************!*\
  !*** ./node_modules/react-displace/dist/displace.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var ReactDOM = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");

// React 16+ supports Portals.
var canUsePortals = !!ReactDOM.createPortal;

function displace(WrappedComponent, options) {
  if (!global.document) {
    return function (_React$Component) {
      _inherits(EmptyDisplace, _React$Component);

      function EmptyDisplace() {
        _classCallCheck(this, EmptyDisplace);

        return _possibleConstructorReturn(this, (EmptyDisplace.__proto__ || Object.getPrototypeOf(EmptyDisplace)).apply(this, arguments));
      }

      _createClass(EmptyDisplace, [{
        key: 'render',
        value: function render() {
          return false;
        }
      }]);

      return EmptyDisplace;
    }(React.Component);
  }

  options = options || {};

  var Displaced = function (_React$Component2) {
    _inherits(Displaced, _React$Component2);

    function Displaced() {
      var _ref;

      var _temp, _this2, _ret;

      _classCallCheck(this, Displaced);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this2 = _possibleConstructorReturn(this, (_ref = Displaced.__proto__ || Object.getPrototypeOf(Displaced)).call.apply(_ref, [this].concat(args))), _this2), _this2.renderDisplaced = function () {
        ReactDOM.unstable_renderSubtreeIntoContainer(_this2, React.createElement(WrappedComponent, _this2.props, _this2.props.children), _this2.container);
      }, _this2.removeDisplaced = function () {
        ReactDOM.unmountComponentAtNode(_this2.container);
      }, _temp), _possibleConstructorReturn(_this2, _ret);
    }

    _createClass(Displaced, [{
      key: 'componentWillMount',
      value: function componentWillMount() {
        this.container = function () {
          if (!options.renderTo) {
            var result = document.createElement('div');
            document.body.appendChild(result);
            return result;
          } else if (typeof options.renderTo === 'string') {
            return document.querySelector(options.renderTo);
          } else {
            return options.renderTo;
          }
        }();
      }
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
        if (canUsePortals) return;
        if (this.props.mounted) {
          this.renderDisplaced();
        }
      }
    }, {
      key: 'componentDidUpdate',
      value: function componentDidUpdate(prevProps) {
        if (canUsePortals) return;
        if (prevProps.mounted && !this.props.mounted) {
          ReactDOM.unmountComponentAtNode(this.container);
        } else if (this.props.mounted) {
          this.renderDisplaced();
        }
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        if (!canUsePortals) {
          ReactDOM.unmountComponentAtNode(this.container);
        }
        if (!options.renderTo) {
          this.container.parentNode.removeChild(this.container);
        }
      }
    }, {
      key: 'render',
      value: function render() {
        if (!canUsePortals || this.props.mounted === false) {
          return null;
        }
        return ReactDOM.createPortal(React.createElement(WrappedComponent, this.props, this.props.children), this.container);
      }
    }]);

    return Displaced;
  }(React.Component);

  Displaced.defaultProps = {
    mounted: true
  };
  Displaced.WrappedComponent = WrappedComponent;


  return Displaced;
}

module.exports = displace;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/tabbable/index.js":
/*!****************************************!*\
  !*** ./node_modules/tabbable/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var candidateSelectors = [
  'input',
  'select',
  'textarea',
  'a[href]',
  'button',
  '[tabindex]',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
];
var candidateSelector = candidateSelectors.join(',');

var matches = typeof Element === 'undefined'
  ? function () {}
  : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;

function tabbable(el, options) {
  options = options || {};

  var elementDocument = el.ownerDocument || el;
  var regularTabbables = [];
  var orderedTabbables = [];

  var untouchabilityChecker = new UntouchabilityChecker(elementDocument);
  var candidates = el.querySelectorAll(candidateSelector);

  if (options.includeContainer) {
    if (matches.call(el, candidateSelector)) {
      candidates = Array.prototype.slice.apply(candidates);
      candidates.unshift(el);
    }
  }

  var i, candidate, candidateTabindex;
  for (i = 0; i < candidates.length; i++) {
    candidate = candidates[i];

    if (!isNodeMatchingSelectorTabbable(candidate, untouchabilityChecker)) continue;

    candidateTabindex = getTabindex(candidate);
    if (candidateTabindex === 0) {
      regularTabbables.push(candidate);
    } else {
      orderedTabbables.push({
        documentOrder: i,
        tabIndex: candidateTabindex,
        node: candidate,
      });
    }
  }

  var tabbableNodes = orderedTabbables
    .sort(sortOrderedTabbables)
    .map(function(a) { return a.node })
    .concat(regularTabbables);

  return tabbableNodes;
}

tabbable.isTabbable = isTabbable;
tabbable.isFocusable = isFocusable;

function isNodeMatchingSelectorTabbable(node, untouchabilityChecker) {
  if (
    !isNodeMatchingSelectorFocusable(node, untouchabilityChecker)
    || isNonTabbableRadio(node)
    || getTabindex(node) < 0
  ) {
    return false;
  }
  return true;
}

function isTabbable(node, untouchabilityChecker) {
  if (!node) throw new Error('No node provided');
  if (matches.call(node, candidateSelector) === false) return false;
  return isNodeMatchingSelectorTabbable(node, untouchabilityChecker);
}

function isNodeMatchingSelectorFocusable(node, untouchabilityChecker) {
  untouchabilityChecker = untouchabilityChecker || new UntouchabilityChecker(node.ownerDocument || node);
  if (
    node.disabled
    || isHiddenInput(node)
    || untouchabilityChecker.isUntouchable(node)
  ) {
    return false;
  }
  return true;
}

var focusableCandidateSelector = candidateSelectors.concat('iframe').join(',');
function isFocusable(node, untouchabilityChecker) {
  if (!node) throw new Error('No node provided');
  if (matches.call(node, focusableCandidateSelector) === false) return false;
  return isNodeMatchingSelectorFocusable(node, untouchabilityChecker);
}

function getTabindex(node) {
  var tabindexAttr = parseInt(node.getAttribute('tabindex'), 10);
  if (!isNaN(tabindexAttr)) return tabindexAttr;
  // Browsers do not return `tabIndex` correctly for contentEditable nodes;
  // so if they don't have a tabindex attribute specifically set, assume it's 0.
  if (isContentEditable(node)) return 0;
  return node.tabIndex;
}

function sortOrderedTabbables(a, b) {
  return a.tabIndex === b.tabIndex ? a.documentOrder - b.documentOrder : a.tabIndex - b.tabIndex;
}

// Array.prototype.find not available in IE.
function find(list, predicate) {
  for (var i = 0, length = list.length; i < length; i++) {
    if (predicate(list[i])) return list[i];
  }
}

function isContentEditable(node) {
  return node.contentEditable === 'true';
}

function isInput(node) {
  return node.tagName === 'INPUT';
}

function isHiddenInput(node) {
  return isInput(node) && node.type === 'hidden';
}

function isRadio(node) {
  return isInput(node) && node.type === 'radio';
}

function isNonTabbableRadio(node) {
  return isRadio(node) && !isTabbableRadio(node);
}

function getCheckedRadio(nodes) {
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].checked) {
      return nodes[i];
    }
  }
}

function isTabbableRadio(node) {
  if (!node.name) return true;
  // This won't account for the edge case where you have radio groups with the same
  // in separate forms on the same page.
  var radioSet = node.ownerDocument.querySelectorAll('input[type="radio"][name="' + node.name + '"]');
  var checked = getCheckedRadio(radioSet);
  return !checked || checked === node;
}

// An element is "untouchable" if *it or one of its ancestors* has
// `visibility: hidden` or `display: none`.
function UntouchabilityChecker(elementDocument) {
  this.doc = elementDocument;
  // Node cache must be refreshed on every check, in case
  // the content of the element has changed. The cache contains tuples
  // mapping nodes to their boolean result.
  this.cache = [];
}

// getComputedStyle accurately reflects `visibility: hidden` of ancestors
// but not `display: none`, so we need to recursively check parents.
UntouchabilityChecker.prototype.hasDisplayNone = function hasDisplayNone(node, nodeComputedStyle) {
  if (node.nodeType !== Node.ELEMENT_NODE) return false;

    // Search for a cached result.
    var cached = find(this.cache, function(item) {
      return item === node;
    });
    if (cached) return cached[1];

    nodeComputedStyle = nodeComputedStyle || this.doc.defaultView.getComputedStyle(node);

    var result = false;

    if (nodeComputedStyle.display === 'none') {
      result = true;
    } else if (node.parentNode) {
      result = this.hasDisplayNone(node.parentNode);
    }

    this.cache.push([node, result]);

    return result;
}

UntouchabilityChecker.prototype.isUntouchable = function isUntouchable(node) {
  if (node === this.doc.documentElement) return false;
  var computedStyle = this.doc.defaultView.getComputedStyle(node);
  if (this.hasDisplayNone(node, computedStyle)) return true;
  return computedStyle.visibility === 'hidden';
}

module.exports = tabbable;


/***/ }),

/***/ "./node_modules/xtend/immutable.js":
/*!*****************************************!*\
  !*** ./node_modules/xtend/immutable.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}


/***/ }),

/***/ "./pages/index.js":
/*!************************!*\
  !*** ./pages/index.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return App; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_text_mask__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-text-mask */ "./node_modules/react-text-mask/dist/reactTextMask.js");
/* harmony import */ var react_text_mask__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_text_mask__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_aria_modal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-aria-modal */ "./node_modules/react-aria-modal/dist/react-aria-modal.js");
/* harmony import */ var react_aria_modal__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_aria_modal__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _styles_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./styles.css */ "./pages/styles.css");
/* harmony import */ var _styles_css__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_styles_css__WEBPACK_IMPORTED_MODULE_4__);
var _jsxFileName = "/home/f/Projects/rooflint/pages/index.js";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






var date = moment__WEBPACK_IMPORTED_MODULE_1___default()(new Date('2019-03-03 00:00'));
var mask = ['+', /[1-9]/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/];

var App =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(App, _PureComponent);

  function App() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, App);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(App)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {});

    return _this;
  }

  _createClass(App, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this.interval = setInterval(function () {
        var duration = moment__WEBPACK_IMPORTED_MODULE_1___default.a.duration(date.diff());
        var days = duration.get('days');
        var hours = duration.get('hours');
        var minutes = duration.get('minutes');
        var seconds = duration.get('seconds');

        _this2.setState({
          days: days,
          hours: hours,
          minutes: minutes,
          seconds: seconds
        });
      }, 1000);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      clearInterval(this.interval);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state = this.state,
          days = _this$state.days,
          hours = _this$state.hours,
          minutes = _this$state.minutes,
          seconds = _this$state.seconds;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "root",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 50
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h1", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 51
        },
        __self: this
      }, "Our Website is ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("b", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 52
        },
        __self: this
      }, "Coming Soon"), ", follow us for updates now!"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("form", {
        action: "https://formspree.io/info@rooflint.com",
        method: "POST",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 54
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        name: "email",
        type: "email",
        required: true,
        placeholder: "Email Address",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 55
        },
        __self: this
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_text_mask__WEBPACK_IMPORTED_MODULE_2___default.a, {
        name: "phone",
        type: "tel",
        mask: mask,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 61
        },
        __self: this
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        type: "submit",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 62
        },
        __self: this
      }, "Subscribe")), days && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "time",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 65
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "time-unit",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 66
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 67
        },
        __self: this
      }, days), " Days"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "time-unit",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 69
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 70
        },
        __self: this
      }, hours), " Hours"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "time-unit",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 72
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 73
        },
        __self: this
      }, minutes), " Minutes"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "time-unit",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 75
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 76
        },
        __self: this
      }, seconds), " Seconds")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("footer", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 80
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", {
        className: "social-links",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 81
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 82
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        title: "Facebook",
        href: "https://www.facebook.com/Rooflint-2236850606338964/",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 83
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
        role: "presentation",
        alt: undefined,
        src: "/static/facebook.png",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 87
        },
        __self: this
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 94
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        title: "YouTube",
        href: "https://www.youtube.com/channel/UCRoXY03hZd5PgdyHJk4N4tQ",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 95
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
        role: "presentation",
        alt: undefined,
        src: "/static/youtube.png",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 99
        },
        __self: this
      }))))));
    }
  }]);

  return App;
}(react__WEBPACK_IMPORTED_MODULE_0__["PureComponent"]);


    (function (Component, route) {
      if(!Component) return
      if (false) {}
      module.hot.accept()
      Component.__route = route

      if (module.hot.status() === 'idle') return

      var components = next.router.components
      for (var r in components) {
        if (!components.hasOwnProperty(r)) continue

        if (components[r].Component.__route === route) {
          next.router.update(r, Component)
        }
      }
    })(typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__.default : (module.exports.default || module.exports), "/")
  
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/harmony-module.js */ "./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ })

})
//# sourceMappingURL=index.js.db3759ae7d81e9fd44f6.hot-update.js.map