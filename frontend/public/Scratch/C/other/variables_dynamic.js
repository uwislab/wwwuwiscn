/**
 * @fileoverview Generating C for dynamic variable blocks.
 */

// 动态类型变量系统实现
C['variables_get_dynamic'] = function (block) {
    // 动态变量获取 - 需要类型检查
    const varName = C.nameDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);

    // 生成类型检查代码
    const typeCheckCode = `assert_dynamic_type("${varName}", ${varName}, DYNAMIC_TYPE_ANY);\n`;
    C.addInclude('assert.h'); // 确保包含断言头文件

    // 返回变量引用和类型检查代码
    return [`(*((dynamic_var*)${varName}_container)->value)`, C.ORDER_ATOMIC];
};

C['variables_set_dynamic'] = function (block) {
    // 动态变量赋值 - 需要类型转换处理
    const varName = C.nameDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    const value = C.valueToCode(block, 'VALUE', C.ORDER_ASSIGNMENT) || '0';

    // 添加必要的头文件
    C.addInclude('stdlib.h');
    C.addInclude('string.h');

    // 在definitions_中添加动态变量支持结构体
    if (!C.definitions_['dynamic_var_def']) {
        C.definitions_['dynamic_var_def'] =
            `typedef enum {
          DYNAMIC_TYPE_INT,
          DYNAMIC_TYPE_FLOAT,
          DYNAMIC_TYPE_STRING,
          DYNAMIC_TYPE_BOOL,
          DYNAMIC_TYPE_ANY
        } dynamic_type;
        
        typedef struct {
          dynamic_type type;
          void* value;
          size_t size;
        } dynamic_var;
        
        #define assert_dynamic_type(var_name, value, expected_type) \\
          if (((dynamic_var*)value)->type != expected_type) { \\
            fprintf(stderr, "Type error for %s: expected %d, got %d\\n", \\
                    var_name, expected_type, ((dynamic_var*)value)->type); \\
            exit(EXIT_FAILURE); \\
          }`;
    }

    // 生成类型安全的赋值代码
    return `{
      dynamic_var* container = ${varName}_container;
      free(container->value); // 释放旧值
      
      // 根据值的类型自动确定新类型
      if (strchr(${value}, '.') != NULL) {
        container->type = DYNAMIC_TYPE_FLOAT;
        container->value = malloc(sizeof(float));
        *((float*)container->value) = atof(${value});
      } else if (strcmp(${value}, "true") == 0 || strcmp(${value}, "false") == 0) {
        container->type = DYNAMIC_TYPE_BOOL;
        container->value = malloc(sizeof(bool));
        *((bool*)container->value) = strcmp(${value}, "true") == 0;
      } else if (${value}[0] == '"' || ${value}[0] == '\'') {
        container->type = DYNAMIC_TYPE_STRING;
        container->size = strlen(${value}) + 1;
        container->value = malloc(container->size);
        strcpy((char*)container->value, ${value});
      } else {
        container->type = DYNAMIC_TYPE_INT;
        container->value = malloc(sizeof(int));
        *((int*)container->value) = atoi(${value});
      }
    }\n`;
};

/**
 * 动态变量声明
 */
C['variables_declare_dynamic'] = function (block) {
    const varName = C.nameDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    const initialValue = C.valueToCode(block, 'VALUE', C.ORDER_ASSIGNMENT) || '0';

    // 添加必要的头文件
    C.addInclude('stdlib.h');
    C.addInclude('string.h');

    // 生成动态变量声明和初始化代码
    return `dynamic_var* ${varName}_container = malloc(sizeof(dynamic_var));
    ${varName}_container->value = NULL;
    ${C['variables_set_dynamic'](block).replace(varName + '_container', varName + '_container')}`;
};

/**
 * 动态变量类型检查
 */
C['variables_check_type'] = function (block) {
    const varName = C.nameDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    const expectedType = block.getFieldValue('TYPE') || 'DYNAMIC_TYPE_ANY';

    return [`(${varName}_container->type == ${expectedType})`, C.ORDER_RELATIONAL];
};

/**
 * 动态变量类型转换
 */
C['variables_cast_type'] = function (block) {
    const varName = C.nameDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    const targetType = block.getFieldValue('TYPE') || 'DYNAMIC_TYPE_INT';

    // 生成类型转换代码
    switch (targetType) {
        case 'DYNAMIC_TYPE_INT':
            return [`(*((int*)${varName}_container->value))`, C.ORDER_ATOMIC];
        case 'DYNAMIC_TYPE_FLOAT':
            return [`(*((float*)${varName}_container->value))`, C.ORDER_ATOMIC];
        case 'DYNAMIC_TYPE_STRING':
            return [`((char*)${varName}_container->value)`, C.ORDER_ATOMIC];
        case 'DYNAMIC_TYPE_BOOL':
            return [`(*((bool*)${varName}_container->value))`, C.ORDER_ATOMIC];
        default:
            return [`(*((void**)${varName}_container->value))`, C.ORDER_ATOMIC];
    }
};