/**
 * @fileoverview Generating C for text blocks.
 */

// 确保包含必要的头文件
C.addInclude('stdio.h');
C.addInclude('string.h');
C.addInclude('stdlib.h');
C.addInclude('ctype.h');
C.addInclude('time.h'); // 用于随机数生成

/**
 * 基础文本块
 */
C['text'] = function(block) {
  // 文本值，使用C字符串格式
  const text = block.getFieldValue('TEXT');
  const escapedText = text
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t')
    .replace(/\r/g, '\\r');
  return [`"${escapedText}"`, C.ORDER_ATOMIC];
};

/**
 * 多行文本块
 */
C['text_multiline'] = function(block) {
  // 多行文本处理
  const lines = block.getFieldValue('TEXT').split('\n');
  const escapedLines = lines.map(line => 
    line.replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\t/g, '\\t')
        .replace(/\r/g, '\\r')
  );
  
  // 生成多行字符串连接
  if (escapedLines.length === 1) {
    return [`"${escapedLines[0]}"`, C.ORDER_ATOMIC];
  }
  
  const code = escapedLines.map(line => `"${line}\\n"`).join(' ');
  return [code, C.ORDER_CONCATENATION];
};

/**
 * 文本连接
 */
C['text_join'] = function(block) {
  // 创建由任意数量元素组成的字符串
  if (block.itemCount_ === 0) {
    return [`""`, C.ORDER_ATOMIC];
  }
  
  const elements = [];
  for (let i = 0; i < block.itemCount_; i++) {
    let element = C.valueToCode(block, 'ADD' + i, C.ORDER_NONE) || `""`;
    // 确保非字符串值被转换为字符串
    if (!element.startsWith('"')) {
      element = `tostring(${element})`;
    }
    elements.push(element);
  }
  
  // 添加动态字符串连接函数
  const functionName = C.provideFunction_('string_concat', `
char* ${C.FUNCTION_NAME_PLACEHOLDER_}(int count, ...) {
  va_list args;
  va_start(args, count);
  
  // 计算总长度
  size_t total_len = 0;
  for (int i = 0; i < count; i++) {
    char* str = va_arg(args, char*);
    total_len += strlen(str);
  }
  va_end(args);
  
  // 分配内存
  char* result = malloc(total_len + 1);
  if (!result) return NULL;
  result[0] = '\\0';
  
  // 拼接字符串
  va_start(args, count);
  for (int i = 0; i < count; i++) {
    char* str = va_arg(args, char*);
    strcat(result, str);
  }
  va_end(args);
  
  return result;
}`);
  
  const code = `${functionName}(${block.itemCount_}, ${elements.join(', ')})`;
  return [code, C.ORDER_FUNCTION_CALL];
};

/**
 * 文本追加
 */
C['text_append'] = function(block) {
  // 追加到变量
  const varName = C.nameDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  const value = C.valueToCode(block, 'TEXT', C.ORDER_NONE) || `""`;
  
  // 添加字符串追加函数
  C.provideFunction_('string_append', `
void ${C.FUNCTION_NAME_PLACEHOLDER_}(char** dest, const char* src) {
  size_t old_len = *dest ? strlen(*dest) : 0;
  size_t src_len = strlen(src);
  *dest = realloc(*dest, old_len + src_len + 1);
  strcpy(*dest + old_len, src);
}`);
  
  return `string_append(&${varName}, ${value});\n`;
};

/**
 * 文本长度
 */
C['text_length'] = function(block) {
  // 字符串长度
  const text = C.valueToCode(block, 'VALUE', C.ORDER_NONE) || `""`;
  return [`strlen(${text})`, C.ORDER_FUNCTION_CALL];
};

/**
 * 文本是否为空
 */
C['text_isEmpty'] = function(block) {
  // 检查字符串是否为空
  const text = C.valueToCode(block, 'VALUE', C.ORDER_NONE) || `""`;
  return [`(strlen(${text}) == 0)`, C.ORDER_RELATIONAL];
};

/**
 * 文本查找
 */
C['text_indexOf'] = function(block) {
  // 查找子字符串
  const substring = C.valueToCode(block, 'FIND', C.ORDER_NONE) || `""`;
  const text = C.valueToCode(block, 'VALUE', C.ORDER_NONE) || `""`;
  
  if (block.getFieldValue('END') === 'FIRST') {
    // 查找第一个出现位置
    return [`(strstr(${text}, ${substring}) ? (strstr(${text}, ${substring}) - ${text} + 1 : 0`, 
            C.ORDER_CONDITIONAL];
  } else {
    // 查找最后一个出现位置
    const functionName = C.provideFunction_('lastIndexOf', `
int ${C.FUNCTION_NAME_PLACEHOLDER_}(const char* str, const char* substr) {
  if (!str || !substr) return 0;
  int str_len = strlen(str);
  int sub_len = strlen(substr);
  if (sub_len == 0) return 0;
  
  for (int i = str_len - sub_len; i >= 0; i--) {
    if (strncmp(str + i, substr, sub_len) == 0) {
      return i + 1;
    }
  }
  return 0;
}`);
    return [`${functionName}(${text}, ${substring})`, C.ORDER_FUNCTION_CALL];
  }
};

/**
 * 获取指定位置字符
 */
C['text_charAt'] = function(block) {
  // 获取指定位置字符
  const where = block.getFieldValue('WHERE') || 'FROM_START';
  const text = C.valueToCode(block, 'VALUE', C.ORDER_NONE) || `""`;
  
  let index;
  if (where === 'RANDOM') {
    // 随机字符
    C.provideFunction_('random_char', `
char ${C.FUNCTION_NAME_PLACEHOLDER_}(const char* str) {
  if (!str || !*str) return '\\0';
  int len = strlen(str);
  return str[rand() % len];
}`);
    return [`random_char(${text})`, C.ORDER_FUNCTION_CALL];
  } else {
    // 获取指定位置字符
    const at = C.valueToCode(block, 'AT', C.ORDER_ADDITIVE) || '1';
    
    if (where === 'FIRST') {
      index = '0';
    } else if (where === 'LAST') {
      index = 'strlen(' + text + ') - 1';
    } else if (where === 'FROM_START') {
      index = at + ' - 1';
    } else if (where === 'FROM_END') {
      index = 'strlen(' + text + ') - ' + at;
    } else {
      throw Error('Unhandled option (text_charAt).');
    }
    
    return [`(${text}[${index}])`, C.ORDER_ATOMIC];
  }
};

/**
 * 获取子字符串
 */
C['text_getSubstring'] = function(block) {
  // 获取子字符串
  const text = C.valueToCode(block, 'STRING', C.ORDER_NONE) || `""`;
  
  // 获取开始位置
  const where1 = block.getFieldValue('WHERE1');
  const at1 = C.valueToCode(block, 'AT1', C.ORDER_ADDITIVE) || '1';
  let start;
  if (where1 === 'FIRST') {
    start = '0';
  } else if (where1 === 'FROM_START') {
    start = at1 + ' - 1';
  } else if (where1 === 'FROM_END') {
    start = 'strlen(' + text + ') - ' + at1;
  } else {
    throw Error('Unhandled option (text_getSubstring)');
  }
  
  // 获取结束位置
  const where2 = block.getFieldValue('WHERE2');
  const at2 = C.valueToCode(block, 'AT2', C.ORDER_ADDITIVE) || '1';
  let end;
  if (where2 === 'LAST') {
    end = 'strlen(' + text + ') - 1';
  } else if (where2 === 'FROM_START') {
    end = at2 + ' - 1';
  } else if (where2 === 'FROM_END') {
    end = 'strlen(' + text + ') - ' + at2;
  } else {
    throw Error('Unhandled option (text_getSubstring)');
  }
  
  // 添加子字符串函数
  const functionName = C.provideFunction_('substring', `
char* ${C.FUNCTION_NAME_PLACEHOLDER_}(const char* str, int start, int end) {
  if (!str || start < 0 || end < 0 || start > end || end >= (int)strlen(str)) {
    return strdup("");
  }
  int len = end - start + 1;
  char* result = malloc(len + 1);
  if (!result) return NULL;
  strncpy(result, str + start, len);
  result[len] = '\\0';
  return result;
}`);
  
  return [`${functionName}(${text}, ${start}, ${end})`, C.ORDER_FUNCTION_CALL];
};

/**
 * 改变大小写
 */
C['text_changeCase'] = function(block) {
  // 改变大小写
  const operator = block.getFieldValue('CASE');
  const text = C.valueToCode(block, 'TEXT', C.ORDER_NONE) || `""`;
  
  if (operator === 'UPPERCASE' || operator === 'LOWERCASE') {
    // 添加大小写转换函数
    const functionName = C.provideFunction_(operator === 'UPPERCASE' ? 'to_upper' : 'to_lower', `
char* ${C.FUNCTION_NAME_PLACEHOLDER_}(const char* str) {
  if (!str) return strdup("");
  char* result = strdup(str);
  for (char* p = result; *p; p++) {
    *p = ${operator === 'UPPERCASE' ? 'toupper(*p)' : 'tolower(*p)'};
  }
  return result;
}`);
    return [`${functionName}(${text})`, C.ORDER_FUNCTION_CALL];
  } else if (operator === 'TITLECASE') {
    // 添加标题大小写函数
    const functionName = C.provideFunction_('to_titlecase', `
char* ${C.FUNCTION_NAME_PLACEHOLDER_}(const char* str) {
  if (!str) return strdup("");
  char* result = strdup(str);
  int capitalize = 1;
  for (char* p = result; *p; p++) {
    if (isspace(*p)) {
      capitalize = 1;
    } else if (capitalize) {
      *p = toupper(*p);
      capitalize = 0;
    } else {
      *p = tolower(*p);
    }
  }
  return result;
}`);
    return [`${functionName}(${text})`, C.ORDER_FUNCTION_CALL];
  }
};

/**
 * 修剪空格
 */
C['text_trim'] = function(block) {
  // 修剪空格
  const mode = block.getFieldValue('MODE');
  const text = C.valueToCode(block, 'TEXT', C.ORDER_NONE) || `""`;
  
  const functionName = C.provideFunction_('trim_string', `
char* ${C.FUNCTION_NAME_PLACEHOLDER_}(const char* str, int mode) {
  if (!str) return strdup("");
  
  // 0=both, 1=left, 2=right
  const char* start = str;
  const char* end = str + strlen(str) - 1;
  
  if (mode == 0 || mode == 1) {
    while (isspace(*start)) start++;
  }
  if (mode == 0 || mode == 2) {
    while (end > start && isspace(*end)) end--;
  }
  
  int len = end - start + 1;
  char* result = malloc(len + 1);
  if (!result) return NULL;
  strncpy(result, start, len);
  result[len] = '\\0';
  return result;
}`);
  
  const modeCode = mode === 'BOTH' ? '0' : (mode === 'LEFT' ? '1' : '2');
  return [`${functionName}(${text}, ${modeCode})`, C.ORDER_FUNCTION_CALL];
};

/**
 * 打印文本
 */
C['text_print'] = function(block) {
  // 打印语句
  const msg = C.valueToCode(block, 'TEXT', C.ORDER_NONE) || `""`;
  return `printf("%s\\n", ${msg});\n`;
};

/**
 * 文本提示输入
 */
C['text_prompt_ext'] = function(block) {
  // 提示输入
  let msg;
  if (block.getField('TEXT')) {
    // 内部消息
    msg = C.quote_(block.getFieldValue('TEXT'));
  } else {
    // 外部消息
    msg = C.valueToCode(block, 'TEXT', C.ORDER_NONE) || `""`;
  }
  
  const toNumber = block.getFieldValue('TYPE') === 'NUMBER';
  if (toNumber) {
    return [`atoi(input_prompt(${msg}))`, C.ORDER_FUNCTION_CALL];
  } else {
    return [`input_prompt(${msg})`, C.ORDER_FUNCTION_CALL];
  }
};

// 添加输入提示函数
C.provideFunction_('input_prompt', `
char* ${C.FUNCTION_NAME_PLACEHOLDER_}(const char* prompt) {
  printf("%s", prompt);
  fflush(stdout);
  
  size_t size = 100;
  char* buffer = malloc(size);
  if (!buffer) return NULL;
  
  size_t len = 0;
  int c;
  while ((c = getchar()) != EOF && c != '\\n') {
    if (len + 1 >= size) {
      size *= 2;
      buffer = realloc(buffer, size);
      if (!buffer) return NULL;
    }
    buffer[len++] = c;
  }
  buffer[len] = '\\0';
  return buffer;
}`);

// 为简单提示创建别名
C['text_prompt'] = C['text_prompt_ext'];

/**
 * 子字符串计数
 */
C['text_count'] = function(block) {
  const text = C.valueToCode(block, 'TEXT', C.ORDER_NONE) || `""`;
  const sub = C.valueToCode(block, 'SUB', C.ORDER_NONE) || `""`;
  
  const functionName = C.provideFunction_('count_substrings', `
int ${C.FUNCTION_NAME_PLACEHOLDER_}(const char* str, const char* sub) {
  if (!str || !sub) return 0;
  int count = 0;
  int sub_len = strlen(sub);
  if (sub_len == 0) return 0;
  
  const char* p = str;
  while ((p = strstr(p, sub)) != NULL) {
    count++;
    p += sub_len;
  }
  return count;
}`);
  
  return [`${functionName}(${text}, ${sub})`, C.ORDER_FUNCTION_CALL];
};

/**
 * 文本替换
 */
C['text_replace'] = function(block) {
  const text = C.valueToCode(block, 'TEXT', C.ORDER_NONE) || `""`;
  const from = C.valueToCode(block, 'FROM', C.ORDER_NONE) || `""`;
  const to = C.valueToCode(block, 'TO', C.ORDER_NONE) || `""`;
  
  const functionName = C.provideFunction_('replace_string', `
char* ${C.FUNCTION_NAME_PLACEHOLDER_}(const char* str, const char* from, const char* to) {
  if (!str) return strdup("");
  if (!from || !*from) return strdup(str);
  
  // 计算需要的内存
  int count = 0;
  int from_len = strlen(from);
  int to_len = strlen(to);
  const char* p = str;
  while ((p = strstr(p, from)) != NULL) {
    count++;
    p += from_len;
  }
  
  size_t new_len = strlen(str) + count * (to_len - from_len) + 1;
  char* result = malloc(new_len);
  if (!result) return NULL;
  
  // 执行替换
  char* dst = result;
  const char* src = str;
  while (*src) {
    if (strstr(src, from) == src) {
      strcpy(dst, to);
      dst += to_len;
      src += from_len;
    } else {
      *dst++ = *src++;
    }
  }
  *dst = '\\0';
  return result;
}`);
  
  return [`${functionName}(${text}, ${from}, ${to})`, C.ORDER_FUNCTION_CALL];
};

/**
 * 反转文本
 */
C['text_reverse'] = function(block) {
  const text = C.valueToCode(block, 'TEXT', C.ORDER_NONE) || `""`;
  
  const functionName = C.provideFunction_('reverse_string', `
char* ${C.FUNCTION_NAME_PLACEHOLDER_}(const char* str) {
  if (!str) return strdup("");
  int len = strlen(str);
  char* result = malloc(len + 1);
  if (!result) return NULL;
  
  for (int i = 0; i < len; i++) {
    result[i] = str[len - 1 - i];
  }
  result[len] = '\\0';
  return result;
}`);
  
  return [`${functionName}(${text})`, C.ORDER_FUNCTION_CALL];
};