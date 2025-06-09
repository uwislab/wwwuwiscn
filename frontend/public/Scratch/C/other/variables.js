/**
 * @fileoverview Generating C for variable blocks.
 */

/**
 * 变量获取
 */
C['variables_get'] = function(block) {
  const varName = C.nameDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  return [varName, C.ORDER_ATOMIC];
};

/**
 * 变量赋值
 */
C['variables_set'] = function(block) {
  const value = C.valueToCode(block, 'VALUE', C.ORDER_ASSIGNMENT) || '0';
  const varName = C.nameDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  return varName + ' = ' + value + ';\n';
};

/**
 * 变量引用
 */
C['data_variable'] = function(block) {
  const varName = C.nameDB_.getName(block.getFieldValue('VARIABLE'), Blockly.Variables.NAME_TYPE);
  return [varName, C.ORDER_ATOMIC];
};

/**
 * 变量设置
 */
C['data_setvariableto'] = function(block) {
  let arg;
  if (block.getField('VALUE')) {
    arg = block.getFieldValue('VALUE');
  } else {
    arg = C.valueToCode(block, 'VALUE', C.ORDER_ASSIGNMENT) || '0';
  }
  
  // 处理字符串引号
  let argLen = arg.length;
  if (argLen >= 2) {
    let _argStart = arg[0];
    let _argEnd = arg[argLen - 1];
    
    if((_argStart === "'" && _argEnd === "'") || (_argStart === '"' && _argEnd === '"')) {
      arg = arg.substring(1, argLen - 1);
    }
  }
  
  const varName = C.nameDB_.getName(
    block.getFieldValue('VARIABLE') || "null", 
    Blockly.Variables.NAME_TYPE
  );
  
  return varName + ' = ' + arg + ';\n';
};

/**
 * 变量增减
 */
C['data_changevariableby'] = function(block) {
  let arg;
  if (block.getField('VALUE')) {
    arg = block.getFieldValue('VALUE');
  } else {
    arg = C.valueToCode(block, 'VALUE', C.ORDER_ADDITIVE) || '0';
  }
  
  // 处理字符串引号
  let argLen = arg.length;
  if (argLen >= 2) {
    let _argStart = arg[0];
    let _argEnd = arg[argLen - 1];
    
    if((_argStart === "'" && _argEnd === "'") || (_argStart === '"' && _argEnd === '"')) {
      arg = arg.substring(1, argLen - 1);
    }
  }
  
  const varName = C.nameDB_.getName(
    block.getFieldValue('VARIABLE') || "null", 
    Blockly.Variables.NAME_TYPE
  );
  
  return varName + ' += ' + arg + ';\n';
};

/**
 * 变量声明块
 * 例如: int x = 0;
 */
C['variables_declare'] = function(block) {
  const type = block.getFieldValue('TYPE') || 'int';
  const varName = C.nameDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  const value = C.valueToCode(block, 'VALUE', C.ORDER_ASSIGNMENT) || '0';
  
  // 如果是字符串类型，添加#include <string.h>
  if (type.includes('char*') || type.includes('char *')) {
    C.addInclude('string.h');
  }
  
  return type + ' ' + varName + ' = ' + value + ';\n';
};

/**
 * 数组声明块
 * 例如: int arr[10] = {0};
 */
C['variables_declare_array'] = function(block) {
  const type = block.getFieldValue('TYPE') || 'int';
  const varName = C.nameDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  const size = C.valueToCode(block, 'SIZE', C.ORDER_ATOMIC) || '10';
  
  // 初始化值处理
  let initializer = '0';
  if (block.getFieldValue('INITIALIZER')) {
    initializer = block.getFieldValue('INITIALIZER');
  } else if (block.getInput('INITIALIZER')) {
    initializer = C.valueToCode(block, 'INITIALIZER', C.ORDER_ATOMIC) || '0';
  }
  
  // 如果是字符串数组，添加#include <string.h>
  if (type.includes('char*') || type.includes('char *')) {
    C.addInclude('string.h');
  }
  
  return type + ' ' + varName + '[' + size + '] = {' + initializer + '};\n';
};