/**
 * @fileoverview Generating C for motion control blocks.
 */

// 添加必要的头文件
C.addInclude('stdio.h');
C.addInclude('stdlib.h');
C.addInclude('unistd.h'); // 用于usleep()

/**
 * 电机控制函数
 */
C['move_motor'] = function(block) {
    // 获取左右电机速度值
    let speed_left = getMotorSpeed(block, 'SPEEDLEFT', '0');
    let speed_right = getMotorSpeed(block, 'SPEEDRIGHT', '0');
    
    // 添加电机控制函数
    C.provideFunction_('motor_control', `
void ${C.FUNCTION_NAME_PLACEHOLDER_}(int left_speed, int right_speed) {
    // 限制速度范围 (-100 到 100)
    left_speed = left_speed > 100 ? 100 : (left_speed < -100 ? -100 : left_speed);
    right_speed = right_speed > 100 ? 100 : (right_speed < -100 ? -100 : right_speed);
    
    // 实际硬件控制代码替换这里
    printf("Setting motors: Left=%d%%, Right=%d%%\\n", left_speed, right_speed);
    
    // 模拟硬件延迟
    usleep(10000); // 10ms
}`);
    
    return `motor_control(${speed_left}, ${speed_right});\n`;
};

/**
 * 停止电机
 */
C['move_motor_stop'] = function(block) {
    // 添加停止电机函数
    C.provideFunction_('motor_stop', `
void ${C.FUNCTION_NAME_PLACEHOLDER_}(void) {
    // 实际硬件停止代码替换这里
    printf("Stopping motors\\n");
    
    // 模拟硬件延迟
    usleep(10000); // 10ms
}`);
    
    return `motor_stop();\n`;
};

/**
 * 辅助函数：获取电机速度值
 */
function getMotorSpeed(block, fieldName, defaultValue) {
    if (block.getField(fieldName)) {
        return String(Number(block.getFieldValue(fieldName)));
    }
    return C.valueToCode(block, fieldName, C.ORDER_NONE) || defaultValue;
}
