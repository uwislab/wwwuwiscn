/**
 * @fileoverview Generating complete C code for sensing blocks.
 */

// 传感器模块头文件声明
C.provideFunction_('sensing_header', `
  #ifndef SENSING_MODULE_H
  #define SENSING_MODULE_H
  
  #include <stdio.h>
  #include <stdint.h>
  #include <stdbool.h>
  #include <stdlib.h>
  #include <time.h>
  #include <math.h>
  
  // 传感器类型定义
  typedef enum {
      SENSOR_OK,
      SENSOR_ERROR,
      SENSOR_NOT_INITIALIZED
  } SensorStatus;
  
  // 传感器模块初始化
  SensorStatus init_sensing_module(void);
  
  #endif // SENSING_MODULE_H
  `);

// 传感器模块实现
C.provideFunction_('sensing_implementation', `
  #include "sensing_module.h"
  
  /* 模块配置参数 */
  #define MAX_SENSORS         8
  #define DEFAULT_CALIBRATION 0.1f
  #define ERROR_CODE         -999.0f
  #define SENSOR_NOISE_LEVEL 0.05f
  
  /* 传感器数据结构 */
  typedef struct {
      uint8_t id;
      float calibration;
      float last_value;
      uint32_t error_count;
      bool is_active;
  } Sensor;
  
  static Sensor sensors[MAX_SENSORS];
  static bool module_initialized = false;
  
  /* 模块初始化 */
  SensorStatus init_sensing_module(void) {
      if (module_initialized) {
          return SENSOR_OK;
      }
  
      srand(time(NULL));
      
      for (int i = 0; i < MAX_SENSORS; i++) {
          sensors[i].id = i + 1;
          sensors[i].calibration = DEFAULT_CALIBRATION * (i + 1);
          sensors[i].last_value = 0.0f;
          sensors[i].error_count = 0;
          sensors[i].is_active = true;
          
          // 随机模拟部分传感器故障
          if ((rand() % 10) == 0) {
              sensors[i].is_active = false;
          }
      }
  
      module_initialized = true;
      return SENSOR_OK;
  }
  `);

/**
 * 对象偏移量检测
 */
C['sensing_obj_offset'] = function (block) {
  let selectIndex = "1";
  if (block.getField('CURRENTMENU')) {
    selectIndex = String(Number(block.getFieldValue('CURRENTMENU')));
  } else {
    selectIndex = C.valueToCode(block, 'CURRENTMENU', C.ORDER_NONE) || '1';
  }

  // 添加偏移检测函数实现
  C.provideFunction_('sensing_offset_impl', `
  float sensing_offset(int index) {
      if (!module_initialized) {
          fprintf(stderr, "Sensor module not initialized\\n");
          return ERROR_CODE;
      }
  
      if (index < 1 || index > MAX_SENSORS) {
          fprintf(stderr, "Invalid sensor index: %d\\n", index);
          return ERROR_CODE;
      }
  
      Sensor* sensor = &sensors[index - 1];
      if (!sensor->is_active) {
          sensor->error_count++;
          return ERROR_CODE;
      }
  
      // 模拟传感器读数
      float base = (float)index * sensor->calibration;
      float noise = 1.0f + ((float)rand()/RAND_MAX * 2.0f - 1.0f) * SENSOR_NOISE_LEVEL;
      float value = base * noise;
  
      sensor->last_value = value;
      return value;
  }`);

  let code = `sensing_offset(${selectIndex})`;
  return [code, C.ORDER_ATOMIC];
};

/**
 * 对象标志检测
 */
C['sensing_obj'] = function (block) {
  C.provideFunction_('sensing_sign_impl', `
  int sensing_sign(void) {
      if (!module_initialized) return 0;
      
      // 模拟对象检测 (50%概率检测到对象)
      return (rand() % 2) ? 1 : 0;
  }`);

  let code = `sensing_sign()`;
  return [code, C.ORDER_ATOMIC];
};

/**
 * 实时时间获取
 */
C['sensing_real_time'] = function (block) {
  C.provideFunction_('sensing_time_impl', `
  double sensing_sys_second(void) {
      struct timespec ts;
      if (clock_gettime(CLOCK_REALTIME, &ts) != 0) {
          perror("clock_gettime failed");
          return -1.0;
      }
      return (double)ts.tv_sec + (double)ts.tv_nsec / 1e9;
  }`);

  let code = `sensing_sys_second()`;
  return [code, C.ORDER_ATOMIC];
};

/**
 * 重置实时时间
 */
C['sensing_reset_real_time'] = function (block) {
  C.provideFunction_('sensing_reset_impl', `
  void sensing_reset_second(void) {
      // 实际应用中可能重置硬件计时器
      printf("Timer reset\\n");
  }`);

  return `sensing_reset_second();\n`;
};

/**
 * 环境温度检测
 */
C['sensing_temperature'] = function (block) {
  C.provideFunction_('sensing_temp_impl', `
  float sensing_temperature(void) {
      if (!module_initialized) return ERROR_CODE;
      
      // 模拟温度读数 (20-30度范围)
      return 20.0f + (float)rand()/RAND_MAX * 10.0f;
  }`);

  let code = `sensing_temperature()`;
  return [code, C.ORDER_ATOMIC];
};

/**
 * 光线强度检测
 */
C['sensing_light_level'] = function (block) {
  C.provideFunction_('sensing_light_impl', `
  int sensing_light_level(void) {
      if (!module_initialized) return -1;
      
      // 模拟光线读数 (0-100范围)
      return rand() % 101;
  }`);

  let code = `sensing_light_level()`;
  return [code, C.ORDER_ATOMIC];
};

/**
 * 生成完整传感器模块代码
 */
C['sensing_module_complete'] = function (block) {
  // 收集所有生成的函数代码
  const header = C.definitions_['sensing_header'] || '';
  const impl = [
    C.definitions_['sensing_implementation'] || '',
    C.definitions_['sensing_offset_impl'] || '',
    C.definitions_['sensing_sign_impl'] || '',
    C.definitions_['sensing_time_impl'] || '',
    C.definitions_['sensing_reset_impl'] || '',
    C.definitions_['sensing_temp_impl'] || '',
    C.definitions_['sensing_light_impl'] || ''
  ].join('\n\n');

  // 生成示例main函数
  const mainFunction = `
  int main(void) {
      if (init_sensing_module() != SENSOR_OK) {
          fprintf(stderr, "Failed to initialize sensor module\\n");
          return EXIT_FAILURE;
      }
  
      printf("Sensor Demo:\\n");
      printf("Offset: %.2f\\n", sensing_offset(1));
      printf("Object detected: %s\\n", sensing_sign() ? "YES" : "NO");
      printf("Temperature: %.1f°C\\n", sensing_temperature());
      printf("Light level: %d%%\\n", sensing_light_level());
      
      return EXIT_SUCCESS;
  }`;

  return header + '\n\n' + impl + '\n\n' + mainFunction;
};