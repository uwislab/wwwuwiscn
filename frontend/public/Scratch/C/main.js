/**
 * Blockly 到 C 转换主逻辑
 */
'use strict';

// 全局变量
let workspace = null;
let NowSavePro = true; // 当前项目是否已保存

// 页面加载完成后初始化
function load() {
  initializeWorkspace();
  setupEventListeners();

  // 创建初始变量
  workspace.createVariable("我的变量", "", null, true, false);
}

/**
 * 初始化 Blockly 工作区
 */
function initializeWorkspace() {
  // 从 URL 获取配置参数
  const match = location.search.match(/dir=([^&]+)/);
  const rtl = match && match[1] == 'rtl';
  const toolbox = getToolboxElement();
  const side = location.search.match(/side=([^&]+)/)?.[1] || 'start';
  const locale = location.search.match(/locale=([^&]+)/)?.[1] || 'zh-cn';

  // 设置本地化
  Blockly.ScratchMsgs.setLocale(locale);

  // 初始化工作区
  workspace = Blockly.inject('blocklyDiv', {
    comments: true,
    disable: false,
    collapse: false,
    media: './media/',
    readOnly: false,
    rtl: rtl,
    scrollbars: true,
    toolbox: ToolBoxXml,
    toolboxPosition: side == 'top' || side == 'start' ? 'start' : 'end',
    horizontalLayout: side == 'top' || side == 'bottom',
    sounds: false,
    zoom: {
      controls: true,
      wheel: true,
      startScale: 0.675,
      maxScale: 4,
      minScale: 0.25,
      scaleSpeed: 1.1
    },
    colours: {
      fieldShadow: 'rgba(255, 255, 255, 0.3)',
      dragShadowOpacity: 0.6
    }
  });

  // 监听工作区变化
  workspace.addChangeListener(function (e) {
    if ((e.type == "move" || e.type == "ui") &&
      document.getElementById("code_modal").style.display == "block") {
      genCCode();
    }
    NowSavePro = false;
  });
}

/**
 * 设置事件监听器
 */
function setupEventListeners() {
  // 变量弹框关闭按钮
  document.getElementById("var_closebtn").onclick = Blockly.hiddenNewVariable;

  // 模块弹框关闭按钮
  document.getElementById("block_closebtn").onclick = hiddenAddBlock;
}

/**
 * 创建代码显示节点
 * @param {string} code 要显示的代码
 */
function createCodeNode(code) {
  const codePre = document.getElementById("code-pre");
  let codeNode = document.getElementById("code-node");

  if (codeNode) {
    codeNode.remove();
  }

  codeNode = document.createElement("code");
  codeNode.id = "code-node";
  codeNode.className = "hljs";
  codeNode.textContent = code;
  codePre.appendChild(codeNode);
}

/**
 * 获取工具箱元素
 * @return {Element} 工具箱DOM元素
 */
function getToolboxElement() {
  const match = location.search.match(/toolbox=([^&]+)/);
  return document.getElementById('toolbox-' + (match ? match[1] : 'categories'));
}

/**
 * 生成C代码并显示
 */
function genCCode() {
  try {
    const code = Blockly.C.genCode(workspace);
    createCodeNode(code);

    // 高亮显示代码
    if (window.hljs) {
      hljs.highlightAll();
      hljs.initLineNumbersOnLoad();
    }
  } catch (error) {
    console.error("生成C代码时出错:", error);
    showToast("生成代码时出错: " + error.message, "error");
  }
}

/**
 * 导出工作区为XML字符串
 * @return {string} XML字符串
 */
function exportXml() {
  const xml = Blockly.Xml.workspaceToDom(workspace);
  return Blockly.Xml.domToPrettyText(xml);
}

/**
 * 导入XML字符串到工作区
 * @param {string} value XML字符串
 */
function importXml(value) {
  try {
    const xml = Blockly.Xml.textToDom(value);
    Blockly.Xml.clearWorkspaceAndLoadFromXml(xml, workspace);
    workspace.refreshToolboxSelection_();
    genCCode();
    NowSavePro = true;
  } catch (error) {
    console.error("导入XML时出错:", error);
    showToast("导入项目时出错: " + error.message, "error");
  }
}

/**
 * 显示代码抽屉
 */
function showCodeDrawer() {
  genCCode();
  document.getElementById("code_modal").style.display = "block";
}

/**
 * 关闭代码抽屉
 */
function closeCodeDrawer() {
  document.getElementById("code_modal").style.display = "none";
}

/**
 * 显示提示消息
 * @param {string} content 消息内容
 * @param {string} state 状态类型 (success/error)
 */
function showToast(content, state) {
  const blockToast = document.getElementById("block-toast");
  const existingLabel = blockToast.querySelector("label");

  if (existingLabel) {
    blockToast.removeChild(existingLabel);
  }

  const label = document.createElement("label");
  const color = state == "success" ? "#7FFF00" : state == "error" ? "#FF0000" : "#eee";
  label.style = `font-size: 20px;color: ${color};margin: 15px 20px;display: inline-block;white-space: nowrap;`;
  label.textContent = content;

  blockToast.appendChild(label);
  blockToast.style.display = "block";

  setTimeout(() => {
    blockToast.style.display = "none";
  }, 3000);
}

/**
 * 确定添加变量
 */
function sureAddVariable() {
  const input = document.getElementById("var_name_input");
  const varName = input.value.trim();

  if (!varName) {
    showToast("变量名不能为空", "error");
    return;
  }

  if (varName.length > 30) {
    showToast("变量名过长(最大30字符)", "error");
    return;
  }

  if (typeof Blockly.addNewVariable === 'function') {
    Blockly.addNewVariable(varName);
  }
  Blockly.hiddenNewVariable();
}

// 变量弹框相关函数
Blockly.hiddenNewVariable = function () {
  document.getElementById("var_name_input").value = "";
  document.getElementById("var_model").style.display = "none";
};

Blockly.showAddNewVariable = function () {
  document.getElementById("var_model").style.display = "block";
};

// 导出函数供HTML调用
window.load = load;
window.genCCode = genCCode;
window.showCodeDrawer = showCodeDrawer;
window.closeCodeDrawer = closeCodeDrawer;
window.sureAddVariable = sureAddVariable;
window.exportXml = exportXml;
window.importXml = importXml;
window.setLocale = function (locale) {
  workspace.getFlyout().setRecyclingEnabled(false);
  const xml = Blockly.Xml.workspaceToDom(workspace);
  Blockly.ScratchMsgs.setLocale(locale);
  Blockly.Xml.clearWorkspaceAndLoadFromXml(xml, workspace);
  workspace.getFlyout().setRecyclingEnabled(true);
};