/**
 * @fileoverview 生成C语言事件块代码
 */

/**
 * 处理"当绿旗被点击"事件块
 * @param {!Blockly.Block} block 当前处理的Blockly块
 * @return {string} 生成的C代码
 */
C['event_whenflagclicked'] = function (block) {
  // 获取与该事件连接的所有语句块代码
  const branch = C.statementToCode(block, 'STACK');

  // 创建主函数定义
  const functionName = C.provideFunction_(
    'main',
    `void ${C.FUNCTION_NAME_PLACEHOLDER_}(void) {\n` +
    `${C.addVariableDeclarations(branch)}` + // 添加变量声明
    `${branch}` +                           // 添加实际代码
    '}'
  );

  // 返回空字符串，因为代码已通过provideFunction_注册
  return '';
};

/**
 * 完成代码生成，添加必要的头文件和main函数包装
 * @param {string} code 已生成的代码
 * @return {string} 完整的C程序
 */
C.finish = function (code) {
  return `#include <stdio.h>\n` +
    `#include <stdlib.h>\n\n` +
    `// 函数声明\n` +
    `void main(void);\n\n` +
    `${code}\n\n` +
    `int main(int argc, char *argv[]) {\n` +
    `  // 调用Blockly生成的主函数\n` +
    `  main();\n` +
    `  return 0;\n` +
    `}\n`;
};