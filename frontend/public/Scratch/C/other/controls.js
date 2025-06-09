/**
 * @fileoverview 生成C语言控制结构代码
 */

/**
 * continue语句的文本表示
 * @const {string}
 */


const CONTINUE_STATEMENT = 'continue;\n';

/**
 * 添加continue标签（C语言中直接使用continue语句）
 * @param {string} branch 循环体生成的代码
 * @return {string} 处理后的代码
 */
const addContinueLabel = function(branch) {
  // C语言本身支持continue语句，无需特殊处理
  return branch;
};

C['controls_repeat_ext'] = function(block) {
  // 重复指定次数
  let repeats;
  if (block.getField('TIMES')) {
    repeats = String(Number(block.getFieldValue('TIMES')));
  } else {
    repeats = C.valueToCode(block, 'TIMES', C.ORDER_NONE) || '0';
  }
  
  if (Blockly.stringUtils.isNumber(repeats)) {
    repeats = parseInt(repeats, 10);
  }
  
  let branch = C.statementToCode(block, 'SUBSTACK');
  branch = addContinueLabel(branch);
  
  const loopVar = C.nameDB_.getDistinctName('i', Blockly.Variables.NAME_TYPE);
  const code = 
      `for (int ${loopVar} = 0; ${loopVar} < ${repeats}; ${loopVar}++) {\n` +
      `${branch}` +
      `}\n`;
  return code;
};

C['controls_repeat'] = C['controls_repeat_ext'];

C['controls_forever'] = function(block) {
  // 无限循环
  let branch = C.statementToCode(block, 'SUBSTACK');
  branch = addContinueLabel(branch);
  return `while (1) {\n${branch}}\n`;
};

C['controls_wait_until'] = function(block) {
  // 等待直到条件成立
  let conditionCode;
  if (block.getField('CONDITION')) {
    conditionCode = String(block.getFieldValue('CONDITION'));
  } else {
    conditionCode = C.valueToCode(block, 'CONDITION', C.ORDER_NONE) || '0';
  }
  return `while (!(${conditionCode})) {}\n`;
};

C['controls_repeat_until'] = function(block) {
  // 重复直到条件成立
  let conditionCode;
  if (block.getField('CONDITION')) {
    conditionCode = String(block.getFieldValue('CONDITION'));
  } else {
    conditionCode = C.valueToCode(block, 'CONDITION', C.ORDER_NONE) || '0';
  }
  
  let branch = C.statementToCode(block, 'SUBSTACK');
  branch = addContinueLabel(branch);
  
  return `do {\n${branch}} while (!(${conditionCode}));\n`;
};

Blockly.C['controls_if'] = function(block) {
  // 生成if语句的C代码
  let n = 0;
  let code = '', branchCode, conditionCode;
  
  do {
    conditionCode = Blockly.C.valueToCode(block, 'IF' + n,
        Blockly.C.ORDER_NONE) || '0';
    branchCode = Blockly.C.statementToCode(block, 'DO' + n) || '';
    code += (n > 0 ? ' else ' : '') +
        'if (' + conditionCode + ') {\n' + branchCode + '}';
    n++;
  } while (block.getInput('IF' + n));
  
  if (block.getInput('ELSE')) {
    branchCode = Blockly.C.statementToCode(block, 'ELSE') || '';
    code += ' else {\n' + branchCode + '}';
  }
  
  return code + '\n';
};

C['controls_if_else'] = C['controls_if'];

C['controls_wait'] = function(block) {
  // 首先确保 provideFunction_ 方法可用
  if (!C.provideFunction_) {
    throw new Error('C.provideFunction_ is not defined');
  }

  // 定义 waitforseconds 函数
  C.provideFunction_('waitforseconds', [
    '#include <unistd.h>',
    'void waitforseconds(double seconds) {',
    '  usleep(seconds * 1000000);',
    '}'
  ]);

  // 获取等待时间参数
  let time;
  if (block.getField('DURATION')) {
    time = String(Number(block.getFieldValue('DURATION')));
  } else {
    time = C.valueToCode(block, 'DURATION', C.ORDER_NONE) || '0.1';
  }
  
  // 处理数值类型
  if (Blockly.stringUtils.isNumber(time)) {
    time = parseFloat(time, 10);
  }
  
  return `waitforseconds(${time});\n`;
};