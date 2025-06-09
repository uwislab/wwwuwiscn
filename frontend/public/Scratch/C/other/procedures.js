/**
 * @fileoverview Generating C for procedures and functions.
 */

// 添加必要的头文件
C.addInclude('stdbool.h'); // 用于布尔类型

/**
 * 定义有返回值的函数
 */
C['procedures_defreturn'] = function(block) {
  const funcName = C.nameDB_.getName(block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  
  // 处理参数
  const args = [];
  const variables = block.getVars();
  for (let i = 0; i < variables.length; i++) {
    args[i] = C.nameDB_.getName(variables[i], Blockly.Variables.NAME_TYPE);
  }
  
  // 获取函数体和返回值
  let branch = C.statementToCode(block, 'STACK');
  let returnValue = C.valueToCode(block, 'RETURN', C.ORDER_NONE) || '';
  
  // 确定返回类型
  let returnType = 'void';
  if (returnValue) {
    // 简单类型推断（实际项目应更完善）
    if (returnValue.includes('"') || returnValue.includes("'")) {
      returnType = 'char*';
    } else if (returnValue.includes('.')) {
      returnType = 'float';
    } else if (returnValue === 'true' || returnValue === 'false') {
      returnType = 'bool';
    } else {
      returnType = 'int';
    }
  }
  
  // 构建函数定义
  let code = returnType + ' ' + funcName + '(';
  
  // 添加参数声明（简单实现，所有参数默认为int）
  const params = args.map(arg => 'int ' + arg).join(', ');
  code += params + ') {\n';
  
  // 添加函数体
  if (branch) {
    code += C.prefixLines(branch, C.INDENT);
  }
  
  // 添加返回值
  if (returnValue) {
    code += C.INDENT + 'return ' + returnValue + ';\n';
  }
  
  code += '}\n';
  
  // 将函数定义添加到定义列表
  C.definitions_[funcName] = code;
  return null;
};

/**
 * 定义无返回值的函数
 */
C['procedures_defnoreturn'] = function(block) {
  // 与有返回值函数类似，但强制返回类型为void
  const funcName = C.nameDB_.getName(block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  
  const args = [];
  const variables = block.getVars();
  for (let i = 0; i < variables.length; i++) {
    args[i] = C.nameDB_.getName(variables[i], Blockly.Variables.NAME_TYPE);
  }
  
  let branch = C.statementToCode(block, 'STACK');
  
  let code = 'void ' + funcName + '(';
  const params = args.map(arg => 'int ' + arg).join(', ');
  code += params + ') {\n';
  
  if (branch) {
    code += C.prefixLines(branch, C.INDENT);
  }
  
  code += '}\n';
  
  C.definitions_[funcName] = code;
  return null;
};

/**
 * 调用有返回值的函数
 */
C['procedures_callreturn'] = function(block) {
  const funcName = C.nameDB_.getName(block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  
  const args = [];
  const variables = block.getVars();
  for (let i = 0; i < variables.length; i++) {
    args[i] = C.valueToCode(block, 'ARG' + i, C.ORDER_COMMA) || '0';
  }
  
  const code = funcName + '(' + args.join(', ') + ')';
  return [code, C.ORDER_FUNCTION_CALL];
};

/**
 * 调用无返回值的函数
 */
C['procedures_callnoreturn'] = function(block) {
  const tuple = C['procedures_callreturn'](block);
  return tuple[0] + ';\n';
};

/**
 * 条件返回语句
 */
C['procedures_ifreturn'] = function(block) {
  const condition = C.valueToCode(block, 'CONDITION', C.ORDER_NONE) || 'false';
  let code = 'if (' + condition + ') {\n';
  
  if (block.hasReturnValue_) {
    const value = C.valueToCode(block, 'VALUE', C.ORDER_NONE) || '0';
    code += C.INDENT + 'return ' + value + ';\n';
  } else {
    code += C.INDENT + 'return;\n';
  }
  
  code += '}\n';
  return code;
};

/**
 * 布尔型参数报告器
 */
C['argument_reporter_boolean'] = function(block) {
  const nameValue = String(block.getFieldValue("VALUE"));
  const code = C.nameDB_.getName(nameValue, Blockly.Variables.NAME_TYPE);
  return [code, C.ORDER_ATOMIC];
};

/**
 * 字符串/数字参数报告器
 */
C['argument_reporter_string_number'] = function(block) {
  const nameValue = String(block.getFieldValue("VALUE"));
  const code = C.nameDB_.getName(nameValue, Blockly.Variables.NAME_TYPE);
  return [code, C.ORDER_ATOMIC];
};

/**
 * 函数定义（简化版）
 */
C['procedures_definition'] = function(block) {
  const protoBlock = block.getInputTargetBlock('custom_block');
  if (!protoBlock) return '';
  
  const funcName = C.nameDB_.getName(protoBlock.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  
  // 获取参数
  const args = [];
  const variables = protoBlock.getVars();
  for (let i = 0; i < variables.length; i++) {
    args[i] = C.nameDB_.getName(variables[i], Blockly.Variables.NAME_TYPE);
  }
  
  // 获取函数体
  let body = C.statementToCode(block, 'STACK');
  
  // 构建函数定义
  let code = 'void ' + funcName + '(';
  code += args.map(arg => 'int ' + arg).join(', ');
  code += ') {\n';
  code += C.prefixLines(body, C.INDENT);
  code += '}\n';
  
  C.definitions_[funcName] = code;
  return null;
};

/**
 * 函数调用（简化版）
 */
C['procedures_call'] = function(block) {
  const funcName = C.nameDB_.getName(block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  
  // 获取参数
  const args = [];
  const argIds = block.argumentIds_;
  for (let i = 0; i < argIds.length; i++) {
    const argBlock = block.getInputTargetBlock(argIds[i]);
    let arg = '0';
    if (argBlock) {
      const argCode = C.blockToCode(argBlock);
      arg = (argCode instanceof Array) ? argCode[0] : argCode;
    }
    args.push(arg);
  }
  
  return funcName + '(' + args.join(', ') + ');\n';
};

/**
 * 生成完整函数模块代码
 */
// C['procedures_complete'] = function(block) {
//   // 收集所有函数定义
//   let definitions = '';
//   for (const funcName in C.definitions_) {
//     if (C.definitions_.hasOwnProperty(funcName)) {
//       definitions += C.definitions_[funcName] + '\n\n';
//     }
//   }
  
//   // 生成主函数
//   const mainFunction = `
// int main(void) {
//     // 函数调用示例
//     example_function(42);
    
//     return 0;
// }`;

//   return definitions + mainFunction;
// };