/**
 * @fileoverview Generating C for math blocks.
 */

// 添加必要的头文件
C.addInclude('math.h');
C.addInclude('stdlib.h');
C.addInclude('time.h');
C.addInclude('stdbool.h');

/**
 * 数字常量
 */
C['math_number'] = function(block) {
  const num = Number(block.getFieldValue('NUM'));
  const order = num < 0 ? C.ORDER_UNARY : C.ORDER_ATOMIC;
  return [num.toString(), order];
};

/**
 * 基础算术运算
 */
C['math_arithmetic'] = function(block) {
  const OPERATORS = {
    'ADD': [' + ', C.ORDER_ADDITIVE],
    'MINUS': [' - ', C.ORDER_ADDITIVE],
    'MULTIPLY': [' * ', C.ORDER_MULTIPLICATIVE],
    'DIVIDE': [' / ', C.ORDER_MULTIPLICATIVE],
    'POWER': ['pow(', C.ORDER_FUNCTION_CALL]
  };
  
  const op = block.getFieldValue('OP');
  const [operator, order] = OPERATORS[op];
  let arg0 = C.valueToCode(block, 'A', order) || '0';
  let arg1 = C.valueToCode(block, 'B', order) || '0';
  
  // 处理幂运算的特殊情况
  if (op === 'POWER') {
    return [`pow(${arg0}, ${arg1})`, C.ORDER_FUNCTION_CALL];
  }
  
  const code = `(${arg0}${operator}${arg1})`;
  return [code, order];
};

/**
 * 单操作数数学运算
 */
C['math_single'] = function(block) {
  const op = block.getFieldValue('OP');
  let arg = C.valueToCode(block, 'NUM', C.ORDER_NONE) || '0';
  
  // 处理负号特殊情况
  if (op === 'NEG') {
    return [`-${arg}`, C.ORDER_UNARY];
  }
  
  // 处理10的幂
  if (op === 'POW10') {
    return [`pow(10, ${arg})`, C.ORDER_FUNCTION_CALL];
  }
  
  // 其他数学函数
  const FUNCTIONS = {
    'ABS': 'fabs',
    'ROOT': 'sqrt',
    'LN': 'log',
    'LOG10': 'log10',
    'EXP': 'exp',
    'ROUND': 'round',
    'ROUNDUP': 'ceil',
    'ROUNDDOWN': 'floor',
    'SIN': 'sin',
    'COS': 'cos',
    'TAN': 'tan',
    'ASIN': 'asin',
    'ACOS': 'acos',
    'ATAN': 'atan'
  };
  
  // 角度转弧度处理
  if (['SIN', 'COS', 'TAN'].includes(op)) {
    arg = `(${arg} * M_PI / 180.0)`;
  }
  
  // 弧度转角度处理
  if (['ASIN', 'ACOS', 'ATAN'].includes(op)) {
    const code = `${FUNCTIONS[op]}(${arg}) * 180.0 / M_PI`;
    return [code, C.ORDER_MULTIPLICATIVE];
  }
  
  const func = FUNCTIONS[op] || 'fabs';
  return [`${func}(${arg})`, C.ORDER_FUNCTION_CALL];
};

/**
 * 数学常量
 */
C['math_constant'] = function(block) {
  const CONSTANTS = {
    'PI': ['M_PI', C.ORDER_ATOMIC],
    'E': ['M_E', C.ORDER_ATOMIC],
    'GOLDEN_RATIO': ['(1.0 + sqrt(5.0)) / 2.0', C.ORDER_MULTIPLICATIVE],
    'SQRT2': ['M_SQRT2', C.ORDER_ATOMIC],
    'SQRT1_2': ['M_SQRT1_2', C.ORDER_ATOMIC],
    'INFINITY': ['INFINITY', C.ORDER_ATOMIC]
  };
  
  return CONSTANTS[block.getFieldValue('CONSTANT')];
};

/**
 * 数字属性检查
 */
C['math_number_property'] = function(block) {
  const PROPERTIES = {
    'EVEN': [' % 2 == 0', C.ORDER_EQUALITY],
    'ODD': [' % 2 != 0', C.ORDER_EQUALITY],
    'WHOLE': [' == floor(', C.ORDER_EQUALITY],
    'POSITIVE': [' > 0', C.ORDER_RELATIONAL],
    'NEGATIVE': [' < 0', C.ORDER_RELATIONAL],
    'DIVISIBLE_BY': [' % ', C.ORDER_EQUALITY],
    'PRIME': ['is_prime(', C.ORDER_FUNCTION_CALL]
  };
  
  const property = block.getFieldValue('PROPERTY');
  const [suffix, order] = PROPERTIES[property];
  const num = C.valueToCode(block, 'NUMBER_TO_CHECK', C.ORDER_NONE) || '0';
  
  // 处理质数检查
  if (property === 'PRIME') {
    C.provideFunction_('is_prime', `
bool ${C.FUNCTION_NAME_PLACEHOLDER_}(int n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 == 0 || n % 3 == 0) return false;
    for (int i = 5; i * i <= n; i += 6) {
        if (n % i == 0 || n % (i + 2) == 0) {
            return false;
        }
    }
    return true;
}`);
    return [`is_prime(${num})`, C.ORDER_FUNCTION_CALL];
  }
  
  // 处理可整除检查
  if (property === 'DIVISIBLE_BY') {
    const divisor = C.valueToCode(block, 'DIVISOR', C.ORDER_MULTIPLICATIVE) || '1';
    return [`(${num} % ${divisor} == 0)`, C.ORDER_EQUALITY];
  }
  
  // 处理整数检查
  if (property === 'WHOLE') {
    return [`(${num} == floor(${num}))`, C.ORDER_EQUALITY];
  }
  
  return [`(${num}${suffix})`, order];
};

/**
 * 变量增减
 */
C['math_change'] = function(block) {
  const varName = C.nameDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  const delta = C.valueToCode(block, 'DELTA', C.ORDER_ADDITIVE) || '0';
  return `${varName} += ${delta};\n`;
};

/**
 * 列表数学运算
 */
C['math_on_list'] = function(block) {
  const func = block.getFieldValue('OP');
  const list = C.valueToCode(block, 'LIST', C.ORDER_NONE) || '{}';
  
  // 提供各种列表运算函数
  const functionName = C.provideFunction_('list_' + func.toLowerCase(), `
${func === 'AVERAGE' ? 'double' : 'float'} ${C.FUNCTION_NAME_PLACEHOLDER_}(float arr[], int size) {
    ${func === 'SUM' ? `
    float sum = 0;
    for (int i = 0; i < size; i++) sum += arr[i];
    return sum;` : ''}
    
    ${func === 'MIN' ? `
    if (size == 0) return 0;
    float min = arr[0];
    for (int i = 1; i < size; i++) if (arr[i] < min) min = arr[i];
    return min;` : ''}
    
    ${func === 'MAX' ? `
    if (size == 0) return 0;
    float max = arr[0];
    for (int i = 1; i < size; i++) if (arr[i] > max) max = arr[i];
    return max;` : ''}
    
    ${func === 'AVERAGE' ? `
    if (size == 0) return 0.0;
    float sum = 0;
    for (int i = 0; i < size; i++) sum += arr[i];
    return (double)sum / size;` : ''}
    
    ${func === 'MEDIAN' ? `
    if (size == 0) return 0;
    // 创建数组副本进行排序
    float temp[size];
    memcpy(temp, arr, size * sizeof(float));
    qsort(temp, size, sizeof(float), compare_float);
    if (size % 2 == 0) {
        return (temp[size/2 - 1] + temp[size/2]) / 2;
    } else {
        return temp[size/2];
    }` : ''}
    
    ${func === 'STD_DEV' ? `
    if (size < 2) return 0;
    double mean = 0, sum = 0;
    for (int i = 0; i < size; i++) mean += arr[i];
    mean /= size;
    for (int i = 0; i < size; i++) sum += pow(arr[i] - mean, 2);
    return sqrt(sum / (size - 1));` : ''}
}`);

  // 添加比较函数用于排序
  if (func === 'MEDIAN') {
    C.provideFunction_('compare_float', `
int ${C.FUNCTION_NAME_PLACEHOLDER_}(const void* a, const void* b) {
    float arg1 = *(const float*)a;
    float arg2 = *(const float*)b;
    if (arg1 < arg2) return -1;
    if (arg1 > arg2) return 1;
    return 0;
}`);
  }

  return [`${functionName}(${list})`, C.ORDER_FUNCTION_CALL];
};

/**
 * 取模运算
 */
C['math_modulo'] = function(block) {
  const dividend = C.valueToCode(block, 'DIVIDEND', C.ORDER_MULTIPLICATIVE) || '0';
  const divisor = C.valueToCode(block, 'DIVISOR', C.ORDER_MULTIPLICATIVE) || '1';
  return [`fmod(${dividend}, ${divisor})`, C.ORDER_MULTIPLICATIVE];
};

/**
 * 数值约束
 */
C['math_constrain'] = function(block) {
  const value = C.valueToCode(block, 'VALUE', C.ORDER_NONE) || '0';
  const low = C.valueToCode(block, 'LOW', C.ORDER_NONE) || '0';
  const high = C.valueToCode(block, 'HIGH', C.ORDER_NONE) || '0';
  return [`fmin(fmax(${value}, ${low}), ${high})`, C.ORDER_FUNCTION_CALL];
};

/**
 * 随机整数
 */
C['math_random_int'] = function(block) {
  const from = C.valueToCode(block, 'FROM', C.ORDER_NONE) || '0';
  const to = C.valueToCode(block, 'TO', C.ORDER_NONE) || '0';
  
  C.provideFunction_('random_int', `
int ${C.FUNCTION_NAME_PLACEHOLDER_}(int min, int max) {
    static bool seeded = false;
    if (!seeded) {
        srand(time(NULL));
        seeded = true;
    }
    return min + rand() % (max - min + 1);
}`);
  
  return [`random_int(${from}, ${to})`, C.ORDER_FUNCTION_CALL];
};

/**
 * 随机浮点数
 */
C['math_random_float'] = function(block) {
  C.provideFunction_('random_float', `
float ${C.FUNCTION_NAME_PLACEHOLDER_}(void) {
    static bool seeded = false;
    if (!seeded) {
        srand(time(NULL));
        seeded = true;
    }
    return (float)rand() / (float)RAND_MAX;
}`);
  
  return ['random_float()', C.ORDER_FUNCTION_CALL];
};

/**
 * atan2函数
 */
C['math_atan2'] = function(block) {
  const x = C.valueToCode(block, 'X', C.ORDER_NONE) || '0';
  const y = C.valueToCode(block, 'Y', C.ORDER_NONE) || '0';
  return [`atan2(${y}, ${x}) * 180.0 / M_PI`, C.ORDER_MULTIPLICATIVE];
};

C['math_round'] = C['math_single'];

C['math_trig'] = C['math_single'];
