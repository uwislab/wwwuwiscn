/**
 * @fileoverview Generating C for logic blocks.
 */
'use strict';

goog.module('Blockly.C.logic');

const {cGenerator: C} = goog.require('Blockly.C');


C['controls_if'] = function(block) {
  // If/elseif/else condition.
  let n = 0;
  let code = '';
  if (C.STATEMENT_PREFIX) {
    // Automatic prefix insertion is switched off for this block. Add manually.
    code += C.injectId(C.STATEMENT_PREFIX, block);
  }
  
  do {
    const conditionCode = C.valueToCode(block, 'IF' + n, C.ORDER_NONE) || '0';
    let branchCode = C.statementToCode(block, 'DO' + n);
    if (C.STATEMENT_SUFFIX) {
      branchCode = C.prefixLines(
          C.injectId(C.STATEMENT_SUFFIX, block), C.INDENT) + branchCode;
    }
    code += (n > 0 ? 'else ' : '') + 'if (' + conditionCode + ') {\n' + branchCode + '}';
    n++;
  } while (block.getInput('IF' + n));

  if (block.getInput('ELSE') || C.STATEMENT_SUFFIX) {
    let branchCode = C.statementToCode(block, 'ELSE');
    if (C.STATEMENT_SUFFIX) {
      branchCode = C.prefixLines(
          C.injectId(C.STATEMENT_SUFFIX, block), C.INDENT) + branchCode;
    }
    code += ' else {\n' + branchCode + '}';
  }
  return code + '\n';
};

C['controls_ifelse'] = C['controls_if'];

C['logic_compare'] = function(block) {
  // Comparison operator.
  const OPERATORS = {
    'EQ': '==', 
    'NEQ': '!=', 
    'LT': '<', 
    'LTE': '<=', 
    'GT': '>', 
    'GTE': '>='
  };
  const operator = OPERATORS[block.getFieldValue('OP')];
  const argument0 = C.valueToCode(block, 'A', C.ORDER_RELATIONAL) || '0';
  const argument1 = C.valueToCode(block, 'B', C.ORDER_RELATIONAL) || '0';
  const code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, C.ORDER_RELATIONAL];
};

C['logic_operation'] = function(block) {
  // Operations 'and', 'or'.
  const operator = (block.getFieldValue('OP') === 'AND') ? '&&' : '||';
  const order = (operator === '&&') ? C.ORDER_AND : C.ORDER_OR;
  let argument0 = C.valueToCode(block, 'A', order);
  let argument1 = C.valueToCode(block, 'B', order);
  
  if (!argument0 && !argument1) {
    // If there are no arguments, then the return value is false.
    argument0 = '0';
    argument1 = '0';
  } else {
    // Single missing arguments have no effect on the return value.
    const defaultArgument = (operator === '&&') ? '1' : '0';
    if (!argument0) {
      argument0 = defaultArgument;
    }
    if (!argument1) {
      argument1 = defaultArgument;
    }
  }
  const code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

C['logic_negate'] = function(block) {
  // Negation.
  const argument0 = C.valueToCode(block, 'BOOL', C.ORDER_UNARY) || '1';
  const code = '!' + argument0;
  return [code, C.ORDER_UNARY];
};

C['logic_boolean'] = function(block) {
  // Boolean values true and false.
  const code = (block.getFieldValue('BOOL') === 'TRUE') ? '1' : '0';
  return [code, C.ORDER_ATOMIC];
};

C['logic_null'] = function(block) {
  // Null data type (using NULL pointer in C).
  return ['NULL', C.ORDER_ATOMIC];
};

C['logic_ternary'] = function(block) {
  // Ternary operator.
  const value_if = C.valueToCode(block, 'IF', C.ORDER_CONDITIONAL) || '0';
  const value_then = C.valueToCode(block, 'THEN', C.ORDER_CONDITIONAL) || '0';
  const value_else = C.valueToCode(block, 'ELSE', C.ORDER_CONDITIONAL) || '0';
  const code = value_if + ' ? ' + value_then + ' : ' + value_else;
  return [code, C.ORDER_CONDITIONAL];
};