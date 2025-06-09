/**
 * @fileoverview Generating C for operator blocks.
 */

// 添加必要的头文件
C.addInclude('stdlib.h'); // 用于rand()和srand()
C.addInclude('time.h');   // 用于time()
C.addInclude('math.h');   // 用于数学函数

/**
 * 加法运算符
 */
C['operator_add'] = function (block) {
  let num1 = getOperandValue(block, 'NUM1', '0');
  let num2 = getOperandValue(block, 'NUM2', '0');
  const code = `(${num1} + ${num2})`;
  return [code, C.ORDER_ADDITIVE];
};

/**
 * 减法运算符
 */
C['operator_subtract'] = function (block) {
  let num1 = getOperandValue(block, 'NUM1', '0');
  let num2 = getOperandValue(block, 'NUM2', '0');
  const code = `(${num1} - ${num2})`;
  return [code, C.ORDER_ADDITIVE];
};

/**
 * 乘法运算符
 */
C['operator_multiply'] = function (block) {
  let num1 = getOperandValue(block, 'NUM1', '0');
  let num2 = getOperandValue(block, 'NUM2', '0');
  const code = `(${num1} * ${num2})`;
  return [code, C.ORDER_MULTIPLICATIVE];
};

/**
 * 除法运算符
 */
C['operator_divide'] = function (block) {
  let num1 = getOperandValue(block, 'NUM1', '0');
  let num2 = getOperandValue(block, 'NUM2', '1');

  // 添加除零保护
  C.provideFunction_('safe_divide', `
float ${C.FUNCTION_NAME_PLACEHOLDER_}(float a, float b) {
    if (fabs(b) < 1e-6) {
        fprintf(stderr, "Division by zero!\\n");
        return 0.0f;
    }
    return a / b;
}`);

  const code = `safe_divide(${num1}, ${num2})`;
  return [code, C.ORDER_MULTIPLICATIVE];
};

/**
 * 取模运算符
 */
C['operator_mod'] = function (block) {
  let num1 = getOperandValue(block, 'NUM1', '0');
  let num2 = getOperandValue(block, 'NUM2', '1');

  // C语言中fmod用于浮点数取模
  const code = `fmod(${num1}, ${num2})`;
  return [code, C.ORDER_MULTIPLICATIVE];
};

/**
 * 随机数生成
 */
C['operator_random'] = function (block) {
  let from = getOperandValue(block, 'FROM', '0');
  let to = getOperandValue(block, 'TO', '10');

  // 添加随机数生成函数
  C.provideFunction_('random_range', `
int ${C.FUNCTION_NAME_PLACEHOLDER_}(int min, int max) {
    static bool seeded = false;
    if (!seeded) {
        srand(time(NULL));
        seeded = true;
    }
    return min + rand() % (max - min + 1);
}`);

  const code = `random_range(${from}, ${to})`;
  return [code, C.ORDER_FUNCTION_CALL];
};

/**
 * 大于比较
 */
C['operator_gt'] = function (block) {
  let op1 = getOperandValue(block, 'OPERAND1', '0');
  let op2 = getOperandValue(block, 'OPERAND2', '0');
  const code = `(${op1} > ${op2})`;
  return [code, C.ORDER_RELATIONAL];
};

/**
 * 小于比较
 */
C['operator_lt'] = function (block) {
  let op1 = getOperandValue(block, 'OPERAND1', '0');
  let op2 = getOperandValue(block, 'OPERAND2', '0');
  const code = `(${op1} < ${op2})`;
  return [code, C.ORDER_RELATIONAL];
};

/**
 * 等于比较
 */
C['operator_equals'] = function (block) {
  let op1 = getOperandValue(block, 'OPERAND1', '0');
  let op2 = getOperandValue(block, 'OPERAND2', '0');
  const code = `(${op1} == ${op2})`;
  return [code, C.ORDER_EQUALITY];
};

/**
 * 逻辑与
 */
C['operator_and'] = function (block) {
  let op1 = getOperandValue(block, 'OPERAND1', '0');
  let op2 = getOperandValue(block, 'OPERAND2', '0');
  const code = `(${op1} && ${op2})`;
  return [code, C.ORDER_LOGICAL_AND];
};

/**
 * 逻辑或
 */
C['operator_or'] = function (block) {
  let op1 = getOperandValue(block, 'OPERAND1', '0');
  let op2 = getOperandValue(block, 'OPERAND2', '0');
  const code = `(${op1} || ${op2})`;
  return [code, C.ORDER_LOGICAL_OR];
};

/**
 * 逻辑非
 */
C['operator_not'] = function (block) {
  let op = getOperandValue(block, 'OPERAND', '0');
  const code = `(!${op})`;
  return [code, C.ORDER_UNARY];
};

/**
 * 四舍五入
 */
C['operator_round'] = function (block) {
  let num = getOperandValue(block, 'NUM', '0');
  const code = `round(${num})`;
  return [code, C.ORDER_FUNCTION_CALL];
};

/**
 * 数学运算
 */
C['operator_mathop'] = function (block) {
  let op = block.getField('OPERATOR') ?
    block.getFieldValue('OPERAND') :
    C.valueToCode(block, 'OPERATOR', C.ORDER_NONE) || 'abs';
  let num = getOperandValue(block, 'NUM', '0');

  // 转换Lua数学函数名为C函数名
  const opMap = {
    'abs': 'fabs',
    'floor': 'floor',
    'ceil': 'ceil',
    'sqrt': 'sqrt',
    'sin': 'sin',
    'cos': 'cos',
    'tan': 'tan',
    'asin': 'asin',
    'acos': 'acos',
    'atan': 'atan',
    'ln': 'log',
    'log': 'log10',
    'e^': 'exp',
    '10^': 'exp10'
  };

  op = opMap[op] || 'fabs';
  const code = `${op}(${num})`;
  return [code, C.ORDER_FUNCTION_CALL];
};

/**
 * 辅助函数：获取操作数值
 */
function getOperandValue(block, fieldName, defaultValue) {
  if (block.getField(fieldName)) {
    return String(Number(block.getFieldValue(fieldName)));
  }
  return C.valueToCode(block, fieldName, C.ORDER_NONE) || defaultValue;
}
