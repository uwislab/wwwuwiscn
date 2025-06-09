/**
 * @fileoverview 生成C语言颜色相关代码
 */
goog.module('Blockly.C.colour');

const {cGenerator: C} = goog.require('Blockly.C');

// 定义颜色结构体
C.provideFunction_('Color', [
    'typedef struct {',
    '    unsigned char r;',
    '    unsigned char g;',
    '    unsigned char b;',
    '} Color;'
]);

C['colour_picker'] = function(block) {
    // 颜色选择器
    const colour = block.getFieldValue('COLOUR');
    // 将HTML颜色格式(#RRGGBB)转换为C结构体初始化
    const r = parseInt(colour.substr(1, 2), 16);
    const g = parseInt(colour.substr(3, 2), 16);
    const b = parseInt(colour.substr(5, 2), 16);
    const code = `(Color){${r}, ${g}, ${b}}`;
    return [code, C.ORDER_ATOMIC];
};

C['colour_random'] = function(block) {
    // 生成随机颜色
    C.provideFunction_('random_color', [
        '#include <stdlib.h>',
        '#include <time.h>',
        'Color random_color() {',
        '    static int seeded = 0;',
        '    if (!seeded) {',
        '        srand(time(NULL));',
        '        seeded = 1;',
        '    }',
        '    return (Color){rand() % 256, rand() % 256, rand() % 256};',
        '}'
    ]);
    return ['random_color()', C.ORDER_HIGH];
};

C['colour_rgb'] = function(block) {
    // 从RGB百分比组成颜色
    const functionName = C.provideFunction_('color_from_rgb', [
        'Color ' + C.FUNCTION_NAME_PLACEHOLDER_ + '(float r, float g, float b) {',
        '    r = r < 0 ? 0 : (r > 100 ? 100 : r);',
        '    g = g < 0 ? 0 : (g > 100 ? 100 : g);',
        '    b = b < 0 ? 0 : (b > 100 ? 100 : b);',
        '    return (Color){',
        '        (unsigned char)(r * 2.55f + 0.5f),',
        '        (unsigned char)(g * 2.55f + 0.5f),',
        '        (unsigned char)(b * 2.55f + 0.5f)',
        '    };',
        '}'
    ]);
    
    const r = C.valueToCode(block, 'RED', C.ORDER_NONE) || '0';
    const g = C.valueToCode(block, 'GREEN', C.ORDER_NONE) || '0';
    const b = C.valueToCode(block, 'BLUE', C.ORDER_NONE) || '0';
    
    const code = functionName + '(' + r + ', ' + g + ', ' + b + ')';
    return [code, C.ORDER_HIGH];
};

C['colour_blend'] = function(block) {
    // 混合两种颜色
    const functionName = C.provideFunction_('color_blend', [
        'Color ' + C.FUNCTION_NAME_PLACEHOLDER_ + '(Color c1, Color c2, float ratio) {',
        '    ratio = ratio < 0 ? 0 : (ratio > 1 ? 1 : ratio);',
        '    return (Color){',
        '        (unsigned char)(c1.r * (1 - ratio) + c2.r * ratio + 0.5f),',
        '        (unsigned char)(c1.g * (1 - ratio) + c2.g * ratio + 0.5f),',
        '        (unsigned char)(c1.b * (1 - ratio) + c2.b * ratio + 0.5f)',
        '    };',
        '}'
    ]);
    
    const color1 = C.valueToCode(block, 'COLOUR1', C.ORDER_NONE) || '(Color){0,0,0}';
    const color2 = C.valueToCode(block, 'COLOUR2', C.ORDER_NONE) || '(Color){0,0,0}';
    const ratio = C.valueToCode(block, 'RATIO', C.ORDER_NONE) || '0';
    
    const code = functionName + '(' + color1 + ', ' + color2 + ', ' + ratio + ')';
    return [code, C.ORDER_HIGH];
};