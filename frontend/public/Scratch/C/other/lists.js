/**
 * @fileoverview Generating C for list blocks.
 */
'use strict';

goog.module('Blockly.C.lists');

const { NameType } = goog.require('Blockly.Names');
const { cGenerator: C } = goog.require('Blockly.C');

// Helper function to create array declarations
const createArrayDeclaration = function (size) {
  return `int[${size}]`;
};

// Helper function to get array index based on C's 0-based indexing
const getArrayIndex = function (arrayName, where, opt_at) {
  const size = `(sizeof(${arrayName}) / sizeof(${arrayName}[0]))`;
  switch (where) {
    case 'FIRST':
      return '0';
    case 'LAST':
      return `${size} - 1`;
    case 'FROM_END':
      return `${size} - ${opt_at}`;
    case 'FROM_START':
      return `${opt_at} - 1`; // Convert from 1-based to 0-based
    case 'RANDOM':
      return `(rand() % ${size})`;
    default:
      return opt_at;
  }
};

C['lists_create_empty'] = function (block) {
  // Create an empty array in C (fixed size of 1 for simplicity)
  return ['{0}', C.ORDER_ATOMIC];
};

C['lists_create_with'] = function (block) {
  // Create array with elements
  const elements = new Array(block.itemCount_);
  for (let i = 0; i < block.itemCount_; i++) {
    elements[i] = C.valueToCode(block, 'ADD' + i, C.ORDER_NONE) || '0';
  }
  const code = `{${elements.join(', ')}}`;
  return [code, C.ORDER_ATOMIC];
};

C['lists_repeat'] = function (block) {
  // Create array with repeated value
  const element = C.valueToCode(block, 'ITEM', C.ORDER_NONE) || '0';
  const repeatCount = C.valueToCode(block, 'NUM', C.ORDER_NONE) || '0';

  const functionName = C.provideFunction_('create_repeated_array', [
    'void ' + C.FUNCTION_NAME_PLACEHOLDER_ + '(int* arr, int size, int value) {',
    '  for (int i = 0; i < size; i++) {',
    '    arr[i] = value;',
    '  }',
    '}'
  ]);

  const arrayName = C.nameDB_.getDistinctName('tmp_arr', NameType.VARIABLE);
  const code = `int ${arrayName}[${repeatCount}];\n` +
    `${functionName}(${arrayName}, ${repeatCount}, ${element});\n` +
    `${arrayName}`;
  return [code, C.ORDER_ATOMIC];
};

C['lists_length'] = function (block) {
  // Array length
  const list = C.valueToCode(block, 'VALUE', C.ORDER_UNARY) || '{}';
  return [`(sizeof(${list}) / sizeof(${list}[0]))`, C.ORDER_UNARY];
};

C['lists_isEmpty'] = function (block) {
  // Check if array is empty
  const list = C.valueToCode(block, 'VALUE', C.ORDER_UNARY) || '{}';
  const code = `(sizeof(${list}) / sizeof(${list}[0])) == 0`;
  return [code, C.ORDER_RELATIONAL];
};

C['lists_indexOf'] = function (block) {
  // Find item in array
  const item = C.valueToCode(block, 'FIND', C.ORDER_NONE) || '0';
  const list = C.valueToCode(block, 'VALUE', C.ORDER_NONE) || '{}';

  const functionName = C.provideFunction_(
    block.getFieldValue('END') === 'FIRST' ? 'array_first_index' : 'array_last_index',
    [
      'int ' + C.FUNCTION_NAME_PLACEHOLDER_ + '(int arr[], int size, int elem) {',
      block.getFieldValue('END') === 'FIRST' ?
        '  for (int i = 0; i < size; i++) {' :
        '  for (int i = size-1; i >= 0; i--) {',
      '    if (arr[i] == elem) return i+1;', // Return 1-based index
      '  }',
      '  return 0;',
      '}'
    ]);

  const size = `(sizeof(${list}) / sizeof(${list}[0]))`;
  const code = `${functionName}(${list}, ${size}, ${item})`;
  return [code, C.ORDER_HIGH];
};

C['lists_getIndex'] = function (block) {
  // Get element at index
  const mode = block.getFieldValue('MODE') || 'GET';
  const where = block.getFieldValue('WHERE') || 'FROM_START';
  const list = C.valueToCode(block, 'VALUE', C.ORDER_HIGH) || '{}';
  const at = C.valueToCode(block, 'AT', C.ORDER_NONE) || '1';

  const index = getArrayIndex(list, where, at);

  if (mode === 'GET') {
    const code = `${list}[${index}]`;
    return [code, C.ORDER_HIGH];
  } else { // REMOVE or GET_REMOVE
    // Note: Actual removal would require dynamic memory management
    const code = `${list}[${index}]`;
    if (mode === 'GET_REMOVE') {
      return [code, C.ORDER_HIGH];
    } else {
      return `${list}[${index}] = 0;\n`; // Just zero out the element
    }
  }
};

C['lists_setIndex'] = function (block) {
  // Set element at index
  let list = C.valueToCode(block, 'LIST', C.ORDER_HIGH) || '{}';
  const mode = block.getFieldValue('MODE') || 'SET';
  const where = block.getFieldValue('WHERE') || 'FROM_START';
  const at = C.valueToCode(block, 'AT', C.ORDER_NONE) || '1';
  const value = C.valueToCode(block, 'TO', C.ORDER_NONE) || '0';

  let code = '';
  // Handle cases where list is an expression
  if ((where === 'LAST' || where === 'FROM_END' || where === 'RANDOM') &&
    !list.match(/^\w+$/)) {
    const listVar = C.nameDB_.getDistinctName('tmp_list', NameType.VARIABLE);
    code = `int* ${listVar} = ${list};\n`;
    list = listVar;
  }

  const index = getArrayIndex(list, where, at);

  if (mode === 'SET') {
    code += `${list}[${index}] = ${value}`;
  } else { // INSERT
    // Note: Actual insertion would require dynamic memory management
    code += `// Insert not fully supported for fixed arrays\n` +
      `${list}[${index}] = ${value}`;
  }
  return code + ';\n';
};

C['lists_getSublist'] = function (block) {
  // Get subarray
  const list = C.valueToCode(block, 'LIST', C.ORDER_NONE) || '{}';
  const where1 = block.getFieldValue('WHERE1');
  const where2 = block.getFieldValue('WHERE2');
  const at1 = C.valueToCode(block, 'AT1', C.ORDER_NONE) || '1';
  const at2 = C.valueToCode(block, 'AT2', C.ORDER_NONE) || '1';

  const start = getArrayIndex(list, where1, at1);
  const end = getArrayIndex(list, where2, at2);

  const functionName = C.provideFunction_('array_sublist', [
    'int* ' + C.FUNCTION_NAME_PLACEHOLDER_ + '(int source[], int start, int end) {',
    '  int length = end - start + 1;',
    '  int* sub = (int*)malloc(length * sizeof(int));',
    '  if (!sub) return NULL;',
    '  for (int i = 0; i < length; i++) {',
    '    sub[i] = source[start + i];',
    '  }',
    '  return sub;',
    '}'
  ]);

  const code = `${functionName}(${list}, ${start}, ${end})`;
  return [code, C.ORDER_HIGH];
};

C['lists_sort'] = function (block) {
  // Sort array
  const list = C.valueToCode(block, 'LIST', C.ORDER_NONE) || '{}';
  const direction = block.getFieldValue('DIRECTION') === '1' ? 1 : -1;
  const type = block.getFieldValue('TYPE');

  const functionName = C.provideFunction_('array_sort', [
    'void ' + C.FUNCTION_NAME_PLACEHOLDER_ + '(int arr[], int size, int dir) {',
    '  for (int i = 0; i < size-1; i++) {',
    '    for (int j = i+1; j < size; j++) {',
    '      if ((dir == 1 && arr[i] > arr[j]) || (dir == -1 && arr[i] < arr[j])) {',
    '        int temp = arr[i];',
    '        arr[i] = arr[j];',
    '        arr[j] = temp;',
    '      }',
    '    }',
    '  }',
    '}'
  ]);

  const size = `(sizeof(${list}) / sizeof(${list}[0]))`;
  const code = `${functionName}(${list}, ${size}, ${direction});\n` +
    `${list}`;
  return [code, C.ORDER_HIGH];
};

C['lists_split'] = function (block) {
  // Split string into array
  const input = C.valueToCode(block, 'INPUT', C.ORDER_NONE) || '""';
  const delimiter = C.valueToCode(block, 'DELIM', C.ORDER_NONE) || '""';
  const mode = block.getFieldValue('MODE');

  if (mode === 'SPLIT') {
    const functionName = C.provideFunction_('string_split', [
      'char** ' + C.FUNCTION_NAME_PLACEHOLDER_ + '(const char* str, const char* delim) {',
      '  // Simplified implementation - would need proper tokenization in real code',
      '  char** tokens = (char**)malloc(2 * sizeof(char*));',
      '  tokens[0] = strdup(str);',
      '  tokens[1] = NULL;',
      '  return tokens;',
      '}'
    ]);
    return [`${functionName}(${input}, ${delim})`, C.ORDER_HIGH];
  } else { // JOIN
    // Join not implemented as it's complex in C
    return ['NULL /* Join not implemented */', C.ORDER_ATOMIC];
  }
};

C['lists_reverse'] = function (block) {
  // Reverse array
  const list = C.valueToCode(block, 'LIST', C.ORDER_NONE) || '{}';

  const functionName = C.provideFunction_('array_reverse', [
    'void ' + C.FUNCTION_NAME_PLACEHOLDER_ + '(int arr[], int size) {',
    '  for (int i = 0; i < size/2; i++) {',
    '    int temp = arr[i];',
    '    arr[i] = arr[size-1-i];',
    '    arr[size-1-i] = temp;',
    '  }',
    '}'
  ]);

  const size = `(sizeof(${list}) / sizeof(${list}[0]))`;
  const code = `${functionName}(${list}, ${size});\n` +
    `${list}`;
  return [code, C.ORDER_HIGH];
};