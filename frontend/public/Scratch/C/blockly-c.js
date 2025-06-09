// Blockly 到 C 语言生成器
'use strict';

// 初始化 C 语言生成器
if (!Blockly.C) {
    Blockly.C = new Blockly.Generator('C');

    // 初始化变量数据库
    Blockly.C.variableDB_ = new Blockly.Names('VARIABLE');
    Blockly.C.variableDB_.reset = function () {
        this.reset();
    };
}

Blockly.C.INDENT = '  ';

/**
 * 初始化代码生成器
 * @param {Blockly.Workspace} workspace Blockly 工作区
 */
Blockly.C.init = function (workspace) {
    // 确保变量数据库存在
    if (!Blockly.C.variableDB_) {
        Blockly.C.variableDB_ = new Blockly.Names('VARIABLE');

        // 正确实现 reset 方法
        Blockly.C.variableDB_.reset = function () {
            Blockly.Names.prototype.reset.call(this); // 调用父类方法
        };
    }

    // 重置变量数据库
    Blockly.C.variableDB_.reset();

    // 设置变量映射
    if (workspace && workspace.getVariableMap) {
        Blockly.C.variableDB_.setVariableMap(workspace.getVariableMap());
    }

    // 初始化定义存储
    Blockly.C.definitions_ = {};
    Blockly.C.functionNames_ = {};

    // 添加必要的头文件
    let includes = '#include <stdio.h>\n';
    includes += '#include <stdbool.h>\n'; // 支持布尔类型

    // 检查是否需要数学库
    const blocks = workspace.getAllBlocks(false);
    const hasMath = blocks.some(block => block.type.startsWith('math_'));
    if (hasMath) {
        includes += '#include <math.h>\n';
    }

    Blockly.C.definitions_['includes'] = includes;

    // 生成变量声明
    const variables = Blockly.Variables.allUsedVarModels(workspace);
    if (variables.length > 0) {
        let varDeclarations = '// 变量声明\n';
        variables.forEach(variable => {
            const varName = Blockly.C.variableDB_.getName(variable.getId(), 'VARIABLE');
            varDeclarations += `int ${varName};\n`;
        });
        Blockly.C.definitions_['variables'] = varDeclarations;
    }
};

/**
 * 生成完整 C 代码
 * @param {Blockly.Workspace} workspace Blockly 工作区
 * @return {string} 生成的 C 代码
 */
Blockly.C.genCode = function (workspace) {
    Blockly.C.init(workspace);

    // 生成主代码
    let code = Blockly.C.workspaceToCode(workspace);

    // 组合所有部分
    let allCode = '';

    // 添加头文件
    if (Blockly.C.definitions_['includes']) {
        allCode += Blockly.C.definitions_['includes'] + '\n';
    }

    // 添加变量声明
    if (Blockly.C.definitions_['variables']) {
        allCode += Blockly.C.definitions_['variables'] + '\n';
    }

    // 添加主函数
    allCode += 'int main() {\n';
    allCode += Blockly.C.prefixLines(code, Blockly.C.INDENT);
    allCode += '  return 0;\n';
    allCode += '}\n';

    return allCode;
};

// 辅助函数 - 处理代码块连接
Blockly.C.scrub_ = function (block, code, thisOnly) {
    const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    const nextCode = thisOnly ? '' : Blockly.C.blockToCode(nextBlock);
    return code + nextCode;
};

// =============== 积木类型定义 =============== //

// 变量获取
Blockly.C['variables_get'] = function (block) {
    const code = Blockly.C.variableDB_.getName(
        block.getFieldValue('VAR'),
        Blockly.VARIABLE_CATEGORY_NAME
    );
    return [code, Blockly.C.ORDER_ATOMIC];
};

// 变量设置
Blockly.C['variables_set'] = function (block) {
    const value = Blockly.C.valueToCode(block, 'VALUE', Blockly.C.ORDER_ASSIGNMENT) || '0';
    const varName = Blockly.C.variableDB_.getName(
        block.getFieldValue('VAR'),
        Blockly.VARIABLE_CATEGORY_NAME
    );
    return varName + ' = ' + value + ';\n';
};

// 条件语句
Blockly.C['controls_if'] = function (block) {
    let n = 0;
    let code = '';

    do {
        const condition = Blockly.C.valueToCode(block, 'IF' + n, Blockly.C.ORDER_NONE) || 'false';
        const branch = Blockly.C.statementToCode(block, 'DO' + n);
        code += (n > 0 ? 'else ' : '') + 'if (' + condition + ') {\n' + branch + '}\n';
        n++;
    } while (block.getInput('IF' + n));

    if (block.getInput('ELSE')) {
        const branch = Blockly.C.statementToCode(block, 'ELSE');
        code += 'else {\n' + branch + '}\n';
    }

    return code;
};

// 循环语句
Blockly.C['controls_whileUntil'] = function (block) {
    const until = block.getFieldValue('MODE') === 'UNTIL';
    let condition = Blockly.C.valueToCode(
        block, 'BOOL', until ? Blockly.C.ORDER_LOGICAL_NOT : Blockly.C.ORDER_NONE) || 'false';
    if (until) condition = '!' + condition;

    let branch = Blockly.C.statementToCode(block, 'DO');
    branch = Blockly.C.addLoopTrap(branch, block.id);
    return 'while (' + condition + ') {\n' + branch + '}\n';
};

// 数学运算
Blockly.C['math_arithmetic'] = function (block) {
    const OPERATORS = {
        'ADD': [' + ', Blockly.C.ORDER_ADDITIVE],
        'MINUS': [' - ', Blockly.C.ORDER_ADDITIVE],
        'MULTIPLY': [' * ', Blockly.C.ORDER_MULTIPLICATIVE],
        'DIVIDE': [' / ', Blockly.C.ORDER_MULTIPLICATIVE],
        'POWER': ['', Blockly.C.ORDER_NONE]
    };

    const op = block.getFieldValue('OP');
    const [operator, order] = OPERATORS[op];
    const a = Blockly.C.valueToCode(block, 'A', order) || '0';
    const b = Blockly.C.valueToCode(block, 'B', order) || '0';

    if (op === 'POWER') {
        return ['pow(' + a + ', ' + b + ')', Blockly.C.ORDER_FUNCTION_CALL];
    }

    return [a + operator + b, order];
};

// 数字常量
Blockly.C['math_number'] = function (block) {
    return [block.getFieldValue('NUM'), Blockly.C.ORDER_ATOMIC];
};

// 比较运算
Blockly.C['logic_compare'] = function (block) {
    const OPERATORS = {
        'EQ': ' == ',
        'NEQ': ' != ',
        'LT': ' < ',
        'LTE': ' <= ',
        'GT': ' > ',
        'GTE': ' >= '
    };
    const op = block.getFieldValue('OP');
    const a = Blockly.C.valueToCode(block, 'A', Blockly.C.ORDER_RELATIONAL) || '0';
    const b = Blockly.C.valueToCode(block, 'B', Blockly.C.ORDER_RELATIONAL) || '0';

    return [a + OPERATORS[op] + b, Blockly.C.ORDER_RELATIONAL];
};

// 逻辑运算
Blockly.C['logic_operation'] = function (block) {
    const op = block.getFieldValue('OP');
    const operator = op === 'AND' ? ' && ' : ' || ';
    const order = op === 'AND' ? Blockly.C.ORDER_LOGICAL_AND : Blockly.C.ORDER_LOGICAL_OR;
    const a = Blockly.C.valueToCode(block, 'A', order) || 'false';
    const b = Blockly.C.valueToCode(block, 'B', order) || 'false';

    return [a + operator + b, order];
};

// 布尔值
Blockly.C['logic_boolean'] = function (block) {
    return [block.getFieldValue('BOOL') === 'TRUE' ? 'true' : 'false', Blockly.C.ORDER_ATOMIC];
};

// 文本
Blockly.C['text'] = function (block) {
    const text = block.getFieldValue('TEXT');
    return ['"' + text.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"', Blockly.C.ORDER_ATOMIC];
};

// 打印语句
Blockly.C['text_print'] = function (block) {
    const text = Blockly.C.valueToCode(block, 'TEXT', Blockly.C.ORDER_NONE) || '""';
    return 'printf(' + text + ');\n';
};

// 过程定义
Blockly.C['procedures_defnoreturn'] = function (block) {
    const funcName = Blockly.C.variableDB_.getName(
        block.getFieldValue('NAME'),
        Blockly.Procedures.NAME_TYPE
    );
    let branch = Blockly.C.statementToCode(block, 'STACK');
    branch = Blockly.C.addLoopTrap(branch, block.id);

    const code = 'void ' + funcName + '() {\n' + branch + '}\n\n';
    Blockly.C.definitions_[funcName] = code;
    return '';
};

// 过程调用
Blockly.C['procedures_callnoreturn'] = function (block) {
    const funcName = Blockly.C.variableDB_.getName(
        block.getFieldValue('NAME'),
        Blockly.Procedures.NAME_TYPE
    );
    return funcName + '();\n';
};

// 添加循环陷阱以防止无限循环
Blockly.C.addLoopTrap = function (branch, id) {
    return branch ? Blockly.C.prefixLines(branch, Blockly.C.INDENT) : '';
};