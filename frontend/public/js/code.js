'use strict';
/**
 * Create a namespace for the application.
 */
var Code = {};
var uwisHttp = "http://x1.uwis.cn";
var clickNum = 1;
var robotID = '';
var robotPassword = '';
//存储解密后的fid
var fid = '';
//通过fid获取到的代码
var pureCode = '';
//当前项目的名称
var projectName = '';
//通过组件传入的登录信息
var id = '';
var userid = '';
var username = '';
var sortid = '';
var rid = '';
var timecode = '';
//img为ThinkBlock顶部导航栏UI截图后，经过Base64转码后的结果
var img = '/9j/4AAQSkZJRgABAQEAYABgAAD/4RDcRXhpZgAATU0AKgAAAAgABAE7AAIAAAAGAAAISodpAAQAAAABAAAIUJydAAEAAAAMAAAQyOocAAcAAAgMAAAAPgAAAAAc6gAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADExNzYzAAAFkAMAAgAAABQAABCekAQAAgAAABQAABCykpEAAgAAAAM4MAAAkpIAAgAAAAM4MAAA6hwABwAACAwAAAiSAAAAABzqAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAyMjowNzoyNiAxMjowMjo1MQAyMDIyOjA3OjI2IDEyOjAyOjUxAAAAMQAxADcANgAzAAAA/+ELGGh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSfvu78nIGlkPSdXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQnPz4NCjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iPjxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+PHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9InV1aWQ6ZmFmNWJkZDUtYmEzZC0xMWRhLWFkMzEtZDMzZDc1MTgyZjFiIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iLz48cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0idXVpZDpmYWY1YmRkNS1iYTNkLTExZGEtYWQzMS1kMzNkNzUxODJmMWIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+PHhtcDpDcmVhdGVEYXRlPjIwMjItMDctMjZUMTI6MDI6NTEuNzk3PC94bXA6Q3JlYXRlRGF0ZT48L3JkZjpEZXNjcmlwdGlvbj48cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0idXVpZDpmYWY1YmRkNS1iYTNkLTExZGEtYWQzMS1kMzNkNzUxODJmMWIiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+PGRjOmNyZWF0b3I+PHJkZjpTZXEgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj48cmRmOmxpPjExNzYzPC9yZGY6bGk+PC9yZGY6U2VxPg0KCQkJPC9kYzpjcmVhdG9yPjwvcmRmOkRlc2NyaXB0aW9uPjwvcmRmOlJERj48L3g6eG1wbWV0YT4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0ndyc/Pv/bAEMABwUFBgUEBwYFBggHBwgK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';
/*
*函数功能：从href获得参数-
*sHref:   http://www.uwis.com/?arg1=d&arg2=re
*sArgName:arg1, arg2
*return:    the value of arg. d, re
*/
function GetArgsFromHref(sHref) {
  var args = sHref.split("?");

  if (args[0] == sHref) /*参数为空*/ {
    return; /*无需做任何处理*/
  }
  var str = args[1];
  args = str.split("&");
  console.log(args);
  for (var i = 0; i < args.length; i++) {
    str = args[i];
    var arg = str.split("=");
    if (arg.length <= 1) continue;
    if (i == 0)
      if (arg[0] == 'robotID') robotID = arg[1];
    if (i == 1)
      if (arg[0] == 'robotPassword') robotPassword = arg[1];
  }
}
/**
 * Lookup for names of supported languages.  Keys should be in ISO 639 format.
 */
Code.LANGUAGE_NAME = {
  'ar': 'العربية',
  'be-tarask': 'Taraškievica',
  'br': 'Brezhoneg',
  'ca': 'Català',
  'cs': 'Česky',
  'da': 'Dansk',
  'de': 'Deutsch',
  'el': 'Ελληνικά',
  'en': 'English',
  'es': 'Español',
  'et': 'Eesti',
  'fa': 'فارسی',
  'fr': 'Français',
  'he': 'עברית',
  'hrx': 'Hunsrik',
  'hu': 'Magyar',
  'ia': 'Interlingua',
  'is': 'Íslenska',
  'it': 'Italiano',
  'ja': '日本語',
  'ko': '한국어',
  'mk': 'Македонски',
  'ms': 'Bahasa Melayu',
  'nb': 'Norsk Bokmål',
  'nl': 'Nederlands, Vlaams',
  'oc': 'Lenga d\'òc',
  'pl': 'Polski',
  'pms': 'Piemontèis',
  'pt-br': 'Português Brasileiro',
  'ro': 'Română',
  'ru': 'Русский',
  'sc': 'Sardu',
  'sk': 'Slovenčina',
  'sr': 'Српски',
  'sv': 'Svenska',
  'ta': 'தமிழ்',
  'th': 'ภาษาไทย',
  'tlh': 'tlhIngan Hol',
  'tr': 'Türkçe',
  'uk': 'Українська',
  'vi': 'Tiếng Việt',
  'zh-hans': '简体中文',
  'zh-hant': '正體中文'
};

Code.server = 'http://127.0.0.1:8000/test.php';

/**
 * List of RTL languages.
 */
Code.LANGUAGE_RTL = ['ar', 'fa', 'he', 'lki'];

/**
 * Blockly's main workspace.
 * @type {Blockly.WorkspaceSvg}
 */
Code.workspace = null;

function getUserInfo() {
  const arr = document.getElementById("world").attributes.data.value.split(":");
  console.log(arr);
  userid = arr[2].trim().toString();
  username = arr[3].trim().toString();
  sortid = arr[4].trim().toString();
  rid = arr[5].trim().toString();
  timecode = arr[6].trim().toString();
  console.log(userid + "," + username + "," + sortid + "," + rid + "," + timecode);
}

function IsPC() {
  var userAgentInfo = navigator.userAgent;
  var Agents = ["Android", "iPhone",
    "SymbianOS", "Windows Phone",
    "iPad", "iPod"];
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}


/**
 * Extracts a parameter from the URL.
 * If the parameter is absent default_value is returned.
 * @param {string} name The name of the parameter.
 * @param {string} defaultValue Value to return if paramater not found.
 * @return {string} The parameter value or the default value if not found.
 */
Code.getStringParamFromUrl = function (name, defaultValue) {
  var val = location.search.match(new RegExp('[?&]' + name + '=([^&]+)'));
  return val ? decodeURIComponent(val[1].replace(/\+/g, '%20')) : defaultValue;
};

/**
 * Get the language of this user from the URL.
 * @return {string} User's language.
 */
Code.getLang = function () {
  var lang = Code.getStringParamFromUrl('lang', '');
  if (Code.LANGUAGE_NAME[lang] === undefined) {
    // Default to Chinese.
    lang = 'zh-hans';
  }
  return lang;
};

/**
 * Is the current language (Code.LANG) an RTL language?
 * @return {boolean} True if RTL, false if LTR.
 */
Code.isRtl = function () {
  return Code.LANGUAGE_RTL.indexOf(Code.LANG) != -1;
};

/**
 * Load blocks saved on App Engine Storage or in session/local storage.
 * @param {string} defaultXml Text representation of default blocks.
 */
Code.loadBlocks = function (defaultXml) {
  try {
    var loadOnce = window.sessionStorage.loadOnceBlocks;
  } catch (e) {
    // Firefox sometimes throws a SecurityError when accessing sessionStorage.
    // Restarting Firefox fixes this, so it looks like a bug.
    var loadOnce = null;
  }
  if ('BlocklyStorage' in window && window.location.hash.length > 1) {
    // An href with #key trigers an AJAX call to retrieve saved blocks.
    BlocklyStorage.retrieveXml(window.location.hash.substring(1));
  } else if (loadOnce) {
    // Language switching stores the blocks during the reload.
    delete window.sessionStorage.loadOnceBlocks;
    var xml = Blockly.Xml.textToDom(loadOnce);
    Blockly.Xml.domToWorkspace(xml, Code.workspace);
  } else if (defaultXml) {
    // Load the editor with default starting blocks.
    var xml = Blockly.Xml.textToDom(defaultXml);
    Blockly.Xml.domToWorkspace(xml, Code.workspace);
  } else if ('BlocklyStorage' in window) {
    // Restore saved blocks in a separate thread so that subsequent
    // initialization is not affected from a failed load.
    window.setTimeout(BlocklyStorage.restoreBlocks, 0);
  }
};

/**
 * Save the blocks and reload with a different language.
 */
Code.changeLanguage = function () {
  // Store the blocks for the duration of the reload.
  // This should be skipped for the index page, which has no blocks and does
  // not load Blockly.
  // MSIE 11 does not support sessionStorage on file:// URLs.
  if (typeof Blockly != 'undefined' && window.sessionStorage) {
    var xml = Blockly.Xml.workspaceToDom(Code.workspace);
    var text = Blockly.Xml.domToText(xml);
    window.sessionStorage.loadOnceBlocks = text;
  }

  var languageMenu = document.getElementById('languageMenu');
  var newLang = encodeURIComponent(
    languageMenu.options[languageMenu.selectedIndex].value);
  var search = window.location.search;
  if (search.length <= 1) {
    search = '?lang=' + newLang;
  } else if (search.match(/[?&]lang=[^&]*/)) {
    search = search.replace(/([?&]lang=)[^&]*/, '$1' + newLang);
  } else {
    search = search.replace(/\?/, '?lang=' + newLang + '&');
  }

  window.location = window.location.protocol + '//' +
    window.location.host + window.location.pathname + search;
};

/**
 * Bind a function to a button's click event.
 * On touch enabled browsers, ontouchend is treated as equivalent to onclick.
 * @param {!Element|string} el Button element or ID thereof.
 * @param {!Function} func Event handler to bind.
 */
Code.bindClick = function (el, func) {
  if (typeof el == 'string') {
    el = document.getElementById(el);
  }
  var flag = IsPC();
  el.addEventListener('click', func, true);//点击
  if (flag == true) {
    el.addEventListener('touchend', func, true);//手势触摸  
  }
};

/**
 * Load the Prettify CSS and JavaScript.
 */
Code.importPrettify = function () {
  //<link rel="stylesheet" href="../prettify.css">
  //<script src="../prettify.js"></script>
  var link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('href', 'http://www.uwis.cn/uide/public/css/prettify.css');
  document.head.appendChild(link);
  var script = document.createElement('script');
  script.setAttribute('src', 'http://www.uwis.cn/uide/public/js/prettify.js');
  document.head.appendChild(script);
};
/**
 * Highlight the block (or clear highlighting).
 * @param {?string} id ID of block that triggered this action.
 */
Code.highlight = function (id) {
  if (id) {
    var m = id.match(/^block_id_(\d+)$/);
    if (m) {
      id = m[1];
    }
  }
  Blockly.mainWorkspace.ohighlightBlock(id);
};

/**
 * Compute the absolute coordinates and dimensions of an HTML element.
 * @param {!Element} element Element to match.
 * @return {!Object} Contains height, width, x, and y properties.
 * @private
 */
Code.getBBox_ = function (element) {
  var height = element.offsetHeight;
  var width = element.offsetWidth;
  var x = 0;
  var y = 0;
  do {
    x += element.offsetLeft;
    y += element.offsetTop;
    element = element.offsetParent;
  } while (element);
  return {
    height: height,
    width: width,
    x: x,
    y: y
  };
};

/**
 * User's language (e.g. "en").
 * @type {string}
 */
Code.LANG = Code.getLang();

/**
 * List of tab names.
 * @private
 */
Code.TABS_ = ['blocks', 'arduinoc', 'xml'];

Code.selected = 'blocks';

/**
 * Switch the visible pane when a tab is clicked.
 * @param {string} clickedName Name of tab clicked.
 */
Code.tabClick = function (clickedName) {
  // If the XML tab was open, save and render the content.
  var flag = IsPC();
  if (flag == true) {
    if (document.getElementById('tab_xml').className == 'tabon') {
      var xmlTextarea = document.getElementById('content_xml');
      var xmlText = xmlTextarea.value;
      var xmlDom = null;
      try {
        xmlDom = Blockly.Xml.textToDom(xmlText);
      } catch (e) {
        var q =
          window.confirm(MSG['badXml'].replace('%1', e));
        if (!q) {
          // Leave the user on the XML tab.
          return;
        }
      }
      if (xmlDom) {
        Code.workspace.clear();
        Blockly.Xml.domToWorkspace(xmlDom, Code.workspace);
      }
    }
  }
  if (document.getElementById('tab_blocks').className == 'tabon') {
    Code.workspace.setVisible(false);
  }
  // Deselect all tabs and hide all panes.
  for (var i = 0; i < Code.TABS_.length; i++) {
    var name = Code.TABS_[i];
    document.getElementById('tab_' + name).className = 'taboff';
    document.getElementById('content_' + name).style.visibility = 'hidden';
  }

  // Select the active tab.
  Code.selected = clickedName;
  document.getElementById('tab_' + clickedName).className = 'tabon';
  // Show the selected pane.
  document.getElementById('content_' + clickedName).style.visibility =
    'visible';
  Code.renderContent();
  if (clickedName == 'blocks') {
    Code.workspace.setVisible(true);
  }
  Blockly.svgResize(Code.workspace);
};

/**
 * Populate the currently selected pane with content generated from the blocks.
 */
Code.renderContent = function () {
  var content = document.getElementById('content_' + Code.selected);
  // Initialize the pane.
  if (content.id == 'content_xml') {
    var xmlTextarea = document.getElementById('content_xml');
    var xmlDom = Blockly.Xml.workspaceToDom(Code.workspace);
    var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
    xmlTextarea.value = xmlText;
    xmlTextarea.focus();
  } else if (content.id == 'content_arduinoc') {
    var code = Blockly.JavaScript.workspaceToCode(Code.workspace);
    code = ts2c.transpile(code);
    content.textContent = code;
    if (typeof prettyPrintOne == 'function') {
      code = content.innerHTML;
      code = prettyPrintOne(code, 'c');
      content.innerHTML = code;
    }
  }
};
/**
 * Initialize Blockly.  Called on page load.
 */
Code.init = function () {
  getUserInfo();
  // console.log(window.location.hash.substring(1));
  // var sHref=window.location.href; //获取当前页面的url
  // GetArgsFromHref(sHref);
  var flag = IsPC();
  //语言选择框相关功能
  // if(flag == true)
  // {
  // 	Code.initLanguage();
  // }
  // 重置
  Code.bindClick('trashButton',
    function () {
      Code.discard();
      Code.renderContent();
    });
  var rtl = Code.isRtl();
  var container = document.getElementById('content_area');
  var onresize = function (e) {
    var bBox = Code.getBBox_(container);
    for (var i = 0; i < Code.TABS_.length; i++) {
      var el = document.getElementById('content_' + Code.TABS_[i]);
      el.style.top = bBox.y + 'px';
      el.style.left = bBox.x + 'px';
      // Height and width need to be set, read back, then set again to
      // compensate for scrollbars.
      el.style.height = bBox.height + 'px';
      el.style.height = (2 * bBox.height - el.offsetHeight) + 'px';
      el.style.width = bBox.width + 'px';
      el.style.width = (2 * bBox.width - el.offsetWidth) + 'px';
    }
    // Make the 'Blocks' tab line up with the toolbox.
    if (Code.workspace && Code.workspace.toolbox_.width) {
      document.getElementById('tab_blocks').style.minWidth =
        (Code.workspace.toolbox_.width - 38) + 'px';
      // Account for the 19 pixel margin and on each side.
    }
  };
  window.addEventListener('resize', onresize, false);
  for (var messageKey in MSG) {
    if (messageKey.startsWith('cat')) {
      Blockly.Msg[messageKey.toUpperCase()] = MSG[messageKey];
    }
  }


  // Construct the toolbox XML.
  var toolboxText = document.getElementById('toolbox').outerHTML;

  var toolboxXml = Blockly.Xml.textToDom(toolboxText);

  Code.workspace = Blockly.inject('content_blocks',
    {
      grid:
      {
        spacing: 25,
        length: 3,
        colour: '#ccc',
        snap: true
      },
      media: 'http://www.uwis.cn/uide/vendor/blockly/media/',
      rtl: rtl,
      toolbox: toolboxXml,
      zoom: {
        controls: true,
        wheel: false
      }
    });
  // Code.workspace = Blockly.inject('blocklyDiv', { toolbox: document.getElementById('toolbox') });

  // Add to reserved word list: Local variables in execution environment (runJS)
  // and the infinite loop detection function.
  Blockly.JavaScript.addReservedWords('code,timeouts,checkTimeout');

  fid = window.location.hash.substring(1); 		// 获得全局变量 fid 的值
  console.log("init: 解析到的初步的fid为: " + fid);

  // 目前获得的fid格式为：program:CToAYFEzW2gFNA==  ，要去钓前面的 program: 这一段
  var new_fid = fid.split(":", 2);

  fid = new_fid[1];
  console.log("init: new_fid = " + fid);
  getDecodeFid(fid);


  //BlocklyStorage.retrieveXml(fid);
  console.log("解码结果fid=" + fid);
  //getCode();
  importURLXmlFile("http://www.uwis.cn/index.php?c=downloadForScratch&id=" + fid);
  //console.log(fid);
  //console.log(pureCode.length);
  //Code.loadBlocks('');

  if ('BlocklyStorage' in window) {
    // Hook a save function onto unload.
    BlocklyStorage.backupOnUnload(Code.workspace);
  }

  Code.tabClick(Code.selected);

  if (flag == true) {
    // 保存
    Code.bindClick('saveButton', Code.saveXmlFile);
  }


  //运行
  Code.bindClick('runButton', Code.runJS);
  Code.bindClick('stopButton', Code.stopJS);
  Code.bindClick('robotInfoButton', Code.userInfo);
  Code.bindClick('uploadButton', Code.uploadJS);

  for (var i = 0; i < Code.TABS_.length; i++) {
    var name = Code.TABS_[i];
    Code.bindClick('tab_' + name,
      function (name_) {
        return function () {
          Code.tabClick(name_);
        };
      }(name));
  }
  onresize();
  Blockly.svgResize(Code.workspace);

  // Lazy-load the syntax-highlighting.
  window.setTimeout(Code.importPrettify, 1);

};

/**
 * Initialize the page language.
 */
Code.initLanguage = function () {
  // Set the HTML's language and direction.
  var rtl = Code.isRtl();
  document.dir = rtl ? 'rtl' : 'ltr';
  document.head.parentElement.setAttribute('lang', Code.LANG);

  // Sort languages alphabetically.
  var languages = [];
  for (var lang in Code.LANGUAGE_NAME) {
    languages.push([Code.LANGUAGE_NAME[lang], lang]);
  }
  var comp = function (a, b) {
    // Sort based on first argument ('English', 'Русский', '简体字', etc).
    if (a[0] > b[0]) return 1;
    if (a[0] < b[0]) return -1;
    return 0;
  };
  languages.sort(comp);
  // Populate the language selection menu.
  var languageMenu = document.getElementById('languageMenu');
  //语言选择框相关功能
  //languageMenu.options.length = 0;
  for (var i = 0; i < languages.length; i++) {
    var tuple = languages[i];
    var lang = tuple[tuple.length - 1];
    var option = new Option(tuple[0], lang);
    if (lang == Code.LANG) {
      option.selected = true;
    }
    languageMenu.options.add(option);
  }
  languageMenu.addEventListener('change', Code.changeLanguage, true);

  // Inject language strings.
  document.title += ' ' + MSG['title'];
};

/**
 * Execute the user's code.
 * Just a quick and dirty eval.  Catch infinite loops.
 */
Code.send = function (url, async) {
  var response;
  var obj = new XMLHttpRequest();
  async = async !== undefined;
  obj.open('GET', url, false);
  obj.onreadystatechange = function (res) {
    if (obj.readyState == 4 && obj.status == 200 || obj.status == 304) { // readyState==4说明请求已完成
      response = obj.responseText;
    } else response = null;
  };
  obj.send(null);
  return response;
};
Code.mqttSend = function (name, code, robotID) {
  $.ajax({
    url: '../../application/libraries/cppMQTTFun.php',
    method: 'post',
    data: {
      name: name,
      code: code,
      car_number: robotID
    }
  })
    .done(function (result) {
      alert(result);
    })
}
/**
 * 直接机器人运行
 * command=run
 * code = code
 */
Code.runJS = function () {
  /* var robotID = document.getElementById("robotID").value;
  var robotPassword = document.getElementById("robotPassword").value; */

  if ((robotID == '') || (robotPassword == '')) {
    //alert('请输入正确的机器人ID和密码！！！');
    /* robotID=prompt("机器人ID","请输入您的机器人ID");
    robotPassword=prompt("机器人密码","请输入您的机器人密码"); */
    Code.userInfo();
  } else {
    var code = Blockly.JavaScript.workspaceToCode(Code.workspace);
    if (code == '') {
      alert('请编写您的程序！！！');
      return;
    } else {
      code = ts2c.transpile(code);
      code = code.replace('#define TRUE 1', 'int is_y = 1;');
      code = code.replace('#define FALSE 0', 'int is_n = 0;');
      code = code.replace('TRUE', 'is_y')
      code = code.replace('FALSE', 'is_n');
      code = code.replace('int main(void)', 'int loop()');
      //console.log(code);
      //code = code + 'loop();void main(){}';
      code = '@C_CODE@A$PC@' + code + 'loop();void main(){}';
      //console.log(code);
      code = window.btoa(unescape(encodeURIComponent(code)));
      if (clickNum == 1) {
        code = 'http://x1.uwis.cn:9090/robot.php?cmd=' + code + '&id=' + robotID + '&password=' + robotPassword;
        uwisHttp = 'http://x1.uwis.cn';
      } else {
        code = 'http://x2.uwis.cn:9090/robot.php?cmd=' + code + '&id=' + robotID + '&password=' + robotPassword;
        uwisHttp = 'http://x2.uwis.cn';
      }
      Code.NetPing(clickNum, code);
    }
  }
};
/**
 * 直接停止机器人运行
 * command=stop
 * code = code
 */
Code.stopJS = function () {
  /*     var robotID = document.getElementById("robotID").value;
      var robotPassword = document.getElementById("robotPassword").value; */
  var sHref = window.location.href;
  GetArgsFromHref(sHref)
  //     if ((robotID == '') || (robotPassword == '')) {
  //         Code.userInfo();
  //     } else {
  //         var code = '@C_CODE@NOW@CSCRIPTEXIT';
  // 		code = window.btoa(unescape(encodeURIComponent(code)));
  // /* 		console.log(code); */
  //         code = uwisHttp +':9090/robot.php?cmd=' + code + '&id=' + robotID + '&password=' + robotPassword;
  // /* 		console.log(code); */
  //         var async;
  //         var clock = Code.send(code, async);
  //         alert(clock);
  // 		return;
  //     }
};
/**
 * 将当前代码上传至官网
 * command=upload
 * code = code
 */
Code.uploadJS = function () {
  //使用Blockly封装的函数，将工作区转变为XML
  const xmlDom = Blockly.Xml.workspaceToDom(Code.workspace);
  //使用Blockly封装的函数，将工作区转变为XML
  const code = Blockly.Xml.domToPrettyText(xmlDom);
  const projectName = prompt("你的项目名称");
  console.log("uploadJS：" + userid + ":" + username + ":" + rid + ":" + sortid);
  if (code == '') {
    alert('请编写您的程序！！！');
    return;
  }
  if (projectName.trim() == "" || projectName == null) {
    alert("项目名不能为空");
    return;
  } else {
    console.log("uploadJS: ready to ajax");
    $.ajax({
      url: 'http://www.uwis.cn/index.php?c=upload',
      type: 'POST',
      data: {
        id: id,
        userid: userid,
        username: username,
        sortid: sortid,
        rid: rid,
        timecode: timecode,
        name: projectName,
        type: 'txml',
        img: img,
        code: code
      },
      dataType: 'json',
      success: function (data) {
        console.log('成功:' + data.message, 2);
      },
      error: function (err) {
        console.log(err.error())
        console.log('失败：' + '未知错误', 2);
      }
    });
  }
}
/**
 * 判断URL是否可以正常使用
 * url=url
 */
Code.NetPing = function (testNum, codeUrl) {
  $.ajax({
    url: codeUrl,
    timeout: 2000,
    type: 'GET',
    success: function (response, status) {
      clickNum = 1;
      alert(response);
      console.log(response);
    },
    error: function (response, status) {

      if (testNum == 2) {
        clickNum = 1;
        alert('服务器维护中，请稍后再试！');
        return;
      } else {
        clickNum = 2;
        Code.runJS();
      }
    }
  });
};

/**
 * Discard all blocks from the workspace.
 */
Code.discard = function () {
  var count = Code.workspace.getAllBlocks().length;
  if (count < 2 ||
    window.confirm(Blockly.Msg.DELETE_ALL_BLOCKS.replace('%1', count))) {
    Code.workspace.clear();
    if (window.location.hash) {
      window.location.hash = '';
    }
  }
};

/**
 * 保存xml
 */
Code.saveXmlFile = function () {
  var xmlDom = Blockly.Xml.workspaceToDom(Code.workspace);
  var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
  // 保存文件
  var file = new File([xmlText], "download.xml", { type: "application/xml;charset=utf-8" });
  saveAs(file);
};

/**
 * 导入
 */
function importURLXmlFile(input) {
  console.log('importing...');
  //支持chrome
  //var file = input.files[0];
  //console.log(file);
  //var xmlurl = "http://www.uwis.cn/thinkblock.xml";
  //根据window.XMLHttpRequest对象是否存在使用不同的创建方式
  var xmlHttp = null;
  if (window.XMLHttpRequest) {
    xmlHttp = new XMLHttpRequest(); //FireFox、Opera等浏览器支持的创建方式
  } else {
    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");//IE浏览器支持的创建方式
  }


  xmlHttp.onreadystatechange = doContents;//调用doContents函数
  xmlHttp.open('GET', input, true);
  xmlHttp.send(null);

  function doContents() {
    if (xmlHttp.readyState == 4) {// 收到完整的服务器响应
      if (xmlHttp.status == 200) {//HTTP服务器响应的值OK

        console.log(xmlHttp.responseText);

        var xmlText = xmlHttp.responseText;
        var xmlDom = Blockly.Xml.textToDom(xmlText);
        Blockly.Xml.domToWorkspace(xmlDom, Code.workspace);
        console.log("ok...");
      }
    } else {
      //alert(xmlHttp.status);
    }
  }
};

/**
 * 导入
 */
Code.importXmlFile = function (input) {
  console.log('importing...');
  //支持chrome
  var file = input.files[0];
  var reader = new FileReader();
  reader.onload = function () {
    var xmlText = this.result;
    var xmlDom = Blockly.Xml.textToDom(xmlText);
    Blockly.Xml.domToWorkspace(xmlDom, Code.workspace);
  };
  reader.readAsText(file);
};

/**
 * 编译
 * command=compile
 * code = code
 */
Code.compileXml = function () {
  console.log('compiling...');
  // converting
  var code = Blockly.JavaScript.workspaceToCode(Code.workspace);
  code = ts2c.transpile(code);
  console.log(code);

  $.ajax({
    url: Code.server,
    type: 'POST',
    data: {
      command: 'compile',
      code: code
    },
    dataType: 'json',
    success: function (data) {
      console.log(data);
    },
    error: function () {
      console.log('cannot find the server: ' + Code.server);
    }
  });

};

/**
 * 烧写
 * command=write
 */
Code.writeXml = function () {
  console.log('writing...');

  $.ajax({
    url: Code.server,
    type: 'POST',
    data: {
      command: 'write',
      code: ''
    },
    dataType: 'json',
    success: function (data) {
      console.log(data);
    },
    error: function () {
      console.log('cannot find the server: ' + Code.server);
    }
  });
};
/**
 * 机器人信息
 * robotID
 * robotPassword
 */
Code.userInfo = function () {
  const arr = prompt("机器人ID：机器人密码", "使用中文冒号分开哦").split("：", 2);
  robotID = arr[0];
  robotPassword = arr[1]
  //若机器人ID或机器人密码为空，则将二者设为空值
  if ((robotID == "" || robotID == null) || (robotPassword == "" || robotPassword == null)) {
    robotID = "";
    robotPassword = "";
    return;
  }
};

//从url中获取加密信息，通过发送ajax请求得到脚本的解密内容
function getDecodeFid(str) {
  $.ajax({
    url: "http://www.uwis.cn/index.php?c=downloadForScratch",
    async: false,
    type: 'get',
    data: {
      function: 'decode',
      fid: str
    },
    dataType: 'json',
    success: function (data) {
      if (data.success) {
        fid = data.fid;
      } else {
        myself.showMessage('未知大大大错误', 2);
      }
    },
    error: function () {
      myself.showMessage('未知错误', 2);
    }
  });
}


// Load the Code demo's language strings.
document.write('<script src="http://www.uwis.cn/uide/public/msg/' + Code.LANG + '.js"></script>\n');
// Load Blockly's language strings.
document.write('<script src="http://www.uwis.cn/uide/vendor/blockly/msg/js/' + Code.LANG + '.js"></script>\n');

window.addEventListener('load', Code.init);