var C = new Blockly.Generator('C');

/**
 * C语言保留字列表
 */
C.addReservedWords(
    // C语言关键字 (C11标准)
    'auto,break,case,char,const,continue,default,do,double,else,enum,' +
    'extern,float,for,goto,if,int,long,register,return,short,signed,' +
    'sizeof,static,struct,switch,typedef,union,unsigned,void,volatile,while,' +
    '_Alignas,_Alignof,_Atomic,_Bool,_Complex,_Generic,_Imaginary,' +
    '_Noreturn,_Static_assert,_Thread_local,' +
    // 常用库函数
    'printf,scanf,malloc,free,memcpy,memset,strlen,strcpy,strcat'
);

/**
 * 运算符优先级
 */
C.ORDER_ATOMIC = 0;       // 字面量
C.ORDER_FUNCTION_CALL = 1; // 函数调用
C.ORDER_POSTFIX = 2;      // [] . -> ++ --
C.ORDER_UNARY = 3;        // + - ! ~ ++ -- * & (type) sizeof
C.ORDER_MULTIPLICATIVE = 4; // * / %
C.ORDER_ADDITIVE = 5;     // + -
C.ORDER_SHIFT = 6;        // << >>
C.ORDER_RELATIONAL = 7;   // < > <= >=
C.ORDER_EQUALITY = 8;     // == !=
C.ORDER_BITWISE_AND = 9;  // &
C.ORDER_BITWISE_XOR = 10; // ^
C.ORDER_BITWISE_OR = 11;  // |
C.ORDER_LOGICAL_AND = 12; // &&
C.ORDER_LOGICAL_OR = 13;  // ||
C.ORDER_CONDITIONAL = 14; // ?:
C.ORDER_ASSIGNMENT = 15;  // = += -= *= /= %= &= ^= |= <<= >>=
C.ORDER_COMMA = 16;       // ,
C.ORDER_NONE = 99;

/**
 * 初始化代码生成器
 * @param {!Workspace} workspace 工作区
 */
C.init = function (workspace) {
    this.variableDB_ = new Blockly.Names(Blockly.Variables.NAME_TYPE);
    this.workspace_ = workspace; // 保存工作区引用
    Object.getPrototypeOf(C).init.call(C);
    if (!C.nameDB_) {
        C.nameDB_ = new Names(C.RESERVED_WORDS_);
    } else {
        C.nameDB_.reset();
    }
    C.nameDB_.setVariableMap(workspace.getVariableMap());

    if (!C.definitions_) {
        C.definitions_ = {};
    }
    if (!C.includes_) {
        C.includes_ = new Set(['stdio.h']); // 默认包含stdio.h
    }
    C.isInitialized = true;
};

/**
 * 完成代码生成，添加头文件和定义
 * @param {string} code 生成的代码
 * @return {string} 完整代码
 */
C.finish = function (code) {
    // 生成include语句
    let includes = '';
    C.includes_.forEach(function (header) {
        includes += '#include <' + header + '>\n';
    });

    // 生成函数定义
    const definitions = Object.values(C.definitions_);

    // 调用父类finish方法
    code = Object.getPrototypeOf(C).finish.call(C, code);
    C.isInitialized = false;

    return includes + '\n' + definitions.join('\n\n') + '\n\n' + code;
};

/**
 * 处理裸值（未连接的表达式）
 * @param {string} line 生成的代码行
 * @return {string} 合法的C语句
 */
C.scrubNakedValue = function (line) {
    return '/* 未使用的表达式 */ ' + line + ';\n';
};

/**
 * 转义字符串
 * @param {string} string 要转义的字符串
 * @return {string} C语言字符串
 */
C.quote_ = function (string) {
    string = string.replace(/\\/g, '\\\\')
        .replace(/\n/g, '\\n')
        .replace(/\t/g, '\\t')
        .replace(/\"/g, '\\"')
        .replace(/\'/g, '\\\'')
        .replace(/\r/g, '\\r');
    return '"' + string + '"';
};

/**
 * 处理块和注释
 * @param {!Block} block 当前块
 * @param {string} code 生成的代码
 * @param {boolean=} opt_thisOnly 是否只处理当前块
 * @return {string} 带注释的代码
 */
C.scrub_ = function (block, code, opt_thisOnly) {
    let commentCode = '';
    // 只收集非内联块的注释
    if (!block.outputConnection || !block.outputConnection.targetConnection) {
        // 收集当前块的注释
        let comment = block.getCommentText();
        if (comment) {
            comment = Blockly.stringUtils.wrap(comment, C.COMMENT_WRAP - 3);
            commentCode += C.prefixLines(comment, '// ') + '\n';
        }
        // 收集所有值输入的注释
        for (let i = 0; i < block.inputList.length; i++) {
            if (block.inputList[i].type === Blockly.inputTypes.VALUE) {
                const childBlock = block.inputList[i].connection.targetBlock();
                if (childBlock) {
                    comment = C.allNestedComments(childBlock);
                    if (comment) {
                        commentCode += C.prefixLines(comment, '// ');
                    }
                }
            }
        }
    }
    const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    const nextCode = opt_thisOnly ? '' : C.blockToCode(nextBlock);
    return commentCode + code + nextCode;
};

/**
 * 生成完整C程序
 * @param {!Workspace} workspace 工作区
 * @return {string} 生成的C代码
 */
C.genCode = function (workspace) {
    C.init(workspace);

    // 收集所有include
    let includes = '';
    C.includes_.forEach(function (header) {
        includes += '#include <' + header + '>\n';
    });

    // 收集函数定义
    const definitions = Object.values(C.definitions_);
    const functions = definitions.join('\n\n');

    // 生成主函数代码
    let mainCode = '';
    const topBlocks = workspace.getTopBlocks();
    for (let i = 0; i < topBlocks.length; i++) {
        if (topBlocks[i].type === 'main_function') {
            mainCode = C.blockToCode(topBlocks[i]);
            break;
        }
    }

    // 如果没有找到主函数，创建一个默认的
    if (!mainCode) {
        mainCode = 'int main() {\n';
        for (let i = 0; i < topBlocks.length; i++) {
            if (!topBlocks[i].type.startsWith('variables_') &&
                !topBlocks[i].type.startsWith('functions_')) {
                mainCode += C.blockToCode(topBlocks[i]);
            }
        }
        mainCode += '    return 0;\n}\n';
    }

    // 重置状态
    C.nameDB_.reset();

    return includes + '\n' + functions + '\n\n' + mainCode;
};

/**
 * 添加头文件包含
 * @param {string} header 头文件名
 */
C.addInclude = function (header) {
    if (C.isInitialized) {
        C.includes_.add(header);
    }
};

/**
 * 添加函数定义
 * @param {string} name 函数名
 * @param {string} code 函数代码
 */
C.addDefinition = function (name, code) {
    if (C.isInitialized) {
        C.definitions_[name] = code;
    }
};

/**
 * 添加变量声明到代码开头
 * @param {string} code 生成的代码
 * @return {string} 包含变量声明的完整代码
 */
C.addVariableDeclarations = function (code) {
    if (!this.variableDB_) {
        return code; // 如果没有变量数据库，直接返回原代码
    }

    const variables = this.variableDB_.getAllVariables();
    let declarations = '';

    variables.forEach(function (variable) {
        declarations += `int ${variable};\n`;
    });

    return declarations ? declarations + '\n' + code : code;
};

C.addVariableDeclarations = function (code) {
    if (!this.variableDB_ || !this.workspace_) {
        return code;
    }

    let declarations = '';
    const variables = this.workspace_.getAllVariables();

    variables.forEach(function (variable) {
        const varName = this.variableDB_.getName(variable.name, Blockly.Variables.NAME_TYPE);
        declarations += `int ${varName};\n`;
    }.bind(this));

    return declarations ? declarations + '\n' + code : code;
};


// 注册基本块生成器
C['variables_get'] = function (block) {
    const varName = C.nameDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    return [varName, C.ORDER_ATOMIC];
};

C['variables_set'] = function (block) {
    const varName = C.nameDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    const value = C.valueToCode(block, 'VALUE', C.ORDER_ASSIGNMENT) || '0';
    return varName + ' = ' + value + ';\n';
};

C['math_number'] = function (block) {
    const number = block.getFieldValue('NUM');
    return [number, C.ORDER_ATOMIC];
};

C['text'] = function (block) {
    const text = C.quote_(block.getFieldValue('TEXT'));
    return [text, C.ORDER_ATOMIC];
};

C['logic_boolean'] = function (block) {
    const bool = block.getFieldValue('BOOL') === 'TRUE' ? 'true' : 'false';
    return [bool, C.ORDER_ATOMIC];
};

Blockly.C = C;