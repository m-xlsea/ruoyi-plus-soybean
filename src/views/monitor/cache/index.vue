<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import { useLoading } from '@sa/hooks';
import { fetchGetMonitorCacheInfo } from '@/service/api/monitor/cache';
import { useEcharts } from '@/hooks/common/echarts';

const { loading, startLoading, endLoading } = useLoading();
const cacheInfo = ref<Api.Monitor.CacheInfo>();
const fetchError = ref<string | null>(null);

// 自动刷新相关状态
const autoRefresh = ref(false);
// 默认30秒刷新一次
const refreshInterval = ref(30);
const refreshTimer = ref<NodeJS.Timeout | null>(null);

async function getCacheInfo() {
  startLoading();
  fetchError.value = null;

  try {
    const { error, data } = await fetchGetMonitorCacheInfo();
    if (!error) {
      cacheInfo.value = data;

      // 确保在数据更新后调用图表更新
      nextTick(() => {
        updateCharts();
        // 单独调用内存图表更新
        updateMemoryChart();
      });
    } else {
      fetchError.value = '获取缓存信息失败';
    }
  } catch {
    fetchError.value = '获取缓存信息出错';
  } finally {
    endLoading();
  }
}

// 处理手动刷新
function handleRefresh() {
  return getCacheInfo()
    .then(() => {
      // 额外的强制刷新尝试
      nextTick(() => {
        forceUpdateCharts();
      });
    })
    .catch(() => {
      // 即使请求失败，也尝试更新图表，以防有一些缓存数据可用
      nextTick(() => {
        if (cacheInfo.value) {
          forceUpdateCharts();
        }
      });
    });
}

// 处理自动刷新开关
function toggleAutoRefresh() {
  if (autoRefresh.value) {
    startAutoRefresh();
  } else {
    stopAutoRefresh();
  }
}

// 启动自动刷新
function startAutoRefresh() {
  stopAutoRefresh(); // 先清除可能存在的定时器
  refreshTimer.value = setInterval(() => {
    getCacheInfo();
  }, refreshInterval.value * 1000);
}

// 停止自动刷新
function stopAutoRefresh() {
  if (refreshTimer.value) {
    clearInterval(refreshTimer.value);
    refreshTimer.value = null;
  }
}

// 更新刷新间隔
function updateRefreshInterval(value: number | null) {
  if (value !== null) {
    refreshInterval.value = value;
    if (autoRefresh.value) {
      startAutoRefresh(); // 重新启动定时器使新间隔生效
    }
  }
}

const { domRef: commandChartRef, updateOptions: updateCommandChart } = useEcharts(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: '#e6e6e6',
    borderWidth: 1,
    textStyle: {
      color: '#666'
    },
    extraCssText: 'box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);'
  },
  legend: {
    type: 'scroll',
    orient: 'vertical',
    right: 10,
    top: 20,
    bottom: 20,
    textStyle: {
      color: '#666'
    }
  },
  series: [
    {
      name: '命令',
      type: 'pie',
      roseType: 'radius',
      radius: [15, 95],
      center: ['40%', '50%'],
      data: [] as Array<{ name: string; value: number }>,
      animationEasing: 'cubicInOut',
      animationDuration: 1000,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        formatter: '{b}: {d}%',
        color: '#666'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '14',
          fontWeight: 'bold'
        },
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}));

const { domRef: memoryGaugeRef, setOptions } = useEcharts(
  () => ({
    tooltip: {
      formatter: '内存使用情况'
    },
    series: [
      {
        name: '内存',
        type: 'gauge',
        min: 0,
        max: 100,
        detail: {
          formatter: '{value}%',
          fontSize: 16,
          fontWeight: 'bold',
          offsetCenter: [0, '70%']
        },
        data: [
          {
            value: 0,
            name: '内存使用率'
          }
        ],
        axisLine: {
          lineStyle: {
            width: 8,
            color: [
              [0.3, '#58d9f9'],
              [0.7, '#26deca'],
              [1, '#ff8c6a']
            ]
          }
        },
        pointer: {
          itemStyle: {
            color: 'auto'
          }
        },
        axisTick: {
          distance: -12,
          length: 4,
          lineStyle: {
            color: '#999',
            width: 1
          }
        },
        splitLine: {
          distance: -18,
          length: 12,
          lineStyle: {
            color: '#999',
            width: 1
          }
        },
        axisLabel: {
          color: '#666',
          distance: 25,
          fontSize: 12
        },
        title: {
          offsetCenter: [0, '90%'],
          fontSize: 14
        },
        animationDuration: 1000
      }
    ]
  }),
  {
    // 自定义渲染和更新钩子
    onRender: chart => {
      chart.hideLoading();
    },
    onUpdated: chart => {
      chart.hideLoading();
    }
  }
);

// 颜色配置
const colorPalette = [
  '#5da8ff',
  '#8e9dff',
  '#fedc69',
  '#26deca',
  '#ff8c6a',
  '#58d9f9',
  '#05c091',
  '#7367f0',
  '#9e86ff',
  '#f8d3a5',
  '#4a5bcc',
  '#22bd7c'
];

// 更新图表数据
function updateCharts() {
  // 确保存在缓存信息才进行更新
  if (!cacheInfo.value) {
    return;
  }

  try {
    // 更新命令统计图表
    updateCommandChart(opts => {
      try {
        const commandStats = cacheInfo.value?.commandStats || [];
        if (!commandStats.length) {
          return opts;
        }

        // 解析命令统计数据 - 适配新的数据格式 {name, value}
        const data = commandStats
          .map(item => {
            try {
              if (!item || typeof item !== 'object') {
                return { name: '未知命令', value: 0 };
              }

              // 检查API返回的数据格式
              if ('name' in item && 'value' in item) {
                const name = String(item.name);
                // 确保将value转换为数字
                let value = 0;
                try {
                  value = Number.parseInt(String(item.value), 10);
                  if (Number.isNaN(value)) value = 0;
                } catch {
                  value = 0;
                }
                return { name, value };
              }
              // 老的处理逻辑，兼容旧格式
              const key = Object.keys(item)[0] || '未知命令';
              let value = 0;
              try {
                value = Number.parseInt(String(Object.values(item)[0] || '0'), 10);
                if (Number.isNaN(value)) value = 0;
              } catch {
                value = 0;
              }
              return { name: key, value };
            } catch {
              return { name: '未知命令', value: 0 };
            }
          })
          .filter(item => item.name !== '未知命令' || item.value > 0);

        if (!data.length) {
          return opts;
        }

        // 按值排序，取前10个命令，剩余的归为"其他"类别
        const sortedData = data.sort((a, b) => b.value - a.value);

        let pieData: Array<{ name: string; value: number }>;
        if (sortedData.length > 10) {
          const top10 = sortedData.slice(0, 10);
          const others = sortedData.slice(10);
          const othersValue = others.reduce((sum, item) => sum + item.value, 0);

          pieData = [...top10, { name: '其他命令', value: othersValue }];
        } else {
          pieData = sortedData;
        }

        // 设置饼图数据和颜色
        if (opts.series && Array.isArray(opts.series) && opts.series[0]) {
          opts.series[0].data = pieData;

          // 设置自定义颜色
          const newItemStyle = {
            ...(opts.series[0].itemStyle || {}),
            color(param: { dataIndex: number }) {
              const index = param.dataIndex % colorPalette.length;
              return colorPalette[index >= 0 ? index : 0];
            }
          };

          opts.series[0].itemStyle = newItemStyle;

          // 增强tooltip展示
          opts.tooltip = {
            ...(opts.tooltip || {}),
            formatter: function tooltipFormatter(params: any) {
              if (!params || typeof params !== 'object') return '';

              const name = params.name || '未知命令';
              const value = typeof params.value === 'number' ? params.value : 0;
              const percent = typeof params.percent === 'number' ? params.percent : 0;

              return (
                `<div style="font-weight:bold;margin-bottom:5px;font-size:14px;">${name}</div>` +
                `<div>执行次数: <span style="font-weight:bold;float:right;">${value.toLocaleString()}</span></div>` +
                `<div>占比: <span style="font-weight:bold;float:right;">${percent.toFixed(2)}%</span></div>`
              );
            } as any
          };
        }

        return opts;
      } catch {
        return opts;
      }
    });

    // 更新内存仪表盘
    updateMemoryChart();
  } catch {
    // 错误已被捕获，无需处理
  }
}

// 更新内存仪表盘数据的方法
function updateMemoryChart() {
  try {
    const info = cacheInfo.value?.info;
    if (!info) {
      return;
    }

    // 使用类型断言处理API返回的实际数据结构
    const infoAny = info as any;

    // 获取内存信息字符串
    const usedMemoryHuman = String(infoAny.used_memory_human || '0B');
    const maxMemoryHuman = String(infoAny.maxmemory_human || '0B');

    // 解析内存字符串
    const usedMem = parseMemoryString(usedMemoryHuman);
    const maxMem = parseMemoryString(maxMemoryHuman);

    // 计算内存使用率
    let usagePercent = 0;

    if (maxMem.bytes > 0) {
      // 如果有最大内存限制，计算使用百分比
      usagePercent = Math.min(100, Math.round((usedMem.bytes / maxMem.bytes) * 100));
    } else if (infoAny.total_system_memory) {
      // 使用系统总内存作为参考
      try {
        const totalMemoryBytes = Number(infoAny.total_system_memory);
        if (totalMemoryBytes > 0) {
          usagePercent = Math.min(100, Math.round((usedMem.bytes / totalMemoryBytes) * 100));
        } else {
          // 无法计算百分比，显示绝对值
          usagePercent = 50; // 仪表盘显示中间值
        }
      } catch {
        usagePercent = 50;
      }
    } else {
      // 没有最大内存限制，显示绝对值
      usagePercent = 50; // 仪表盘显示中间值
    }

    // 完整的仪表盘选项
    const gaugeOption = {
      tooltip: {
        formatter:
          maxMem.bytes > 0
            ? `内存使用: ${usedMemoryHuman}<br/>最大内存: ${maxMemoryHuman}<br/>使用率: ${usagePercent}%`
            : `内存使用: ${usedMemoryHuman}<br/>最大内存: 未设置限制`
      },
      series: [
        {
          name: '内存',
          type: 'gauge' as const,
          min: 0,
          max: 100,
          detail: {
            formatter: maxMem.bytes > 0 ? '{value}%' : usedMemoryHuman,
            fontSize: 16,
            fontWeight: 'bold' as const,
            offsetCenter: [0, '70%']
          },
          data: [
            {
              value: usagePercent,
              name: maxMem.bytes > 0 ? '内存使用率' : '内存使用量'
            }
          ],
          axisLine: {
            lineStyle: {
              width: 8,
              color: [
                [0.3, '#58d9f9'],
                [0.7, '#26deca'],
                [1, '#ff8c6a']
              ]
            }
          },
          pointer: {
            itemStyle: {
              color: 'auto'
            }
          },
          axisTick: {
            distance: -12,
            length: 4,
            lineStyle: {
              color: '#999',
              width: 1
            }
          },
          splitLine: {
            distance: -18,
            length: 12,
            lineStyle: {
              color: '#999',
              width: 1
            }
          },
          axisLabel: {
            color: '#666',
            distance: 25,
            fontSize: 12
          },
          title: {
            offsetCenter: [0, '90%'],
            fontSize: 14
          },
          animationDuration: 1000
        }
      ]
    };

    // 直接设置图表选项
    if (memoryGaugeRef.value) {
      // 使用类型断言绕过TypeScript类型检查
      setOptions(gaugeOption as any);
    }
  } catch {
    // 错误已被捕获，无需处理
  }
}

// 解析内存字符串，例如 "3.6MB" -> { value: 3.6, unit: "MB" }
function parseMemoryString(memoryStr: string): { value: number; unit: string; bytes: number } {
  if (!memoryStr || typeof memoryStr !== 'string') {
    return { value: 0, unit: 'B', bytes: 0 };
  }

  try {
    // 用正则表达式提取数值和单位
    const match = memoryStr.match(/^([\d.]+)([KMGTP]?B)?$/i);
    if (!match) {
      return { value: 0, unit: 'B', bytes: 0 };
    }

    const value = Number.parseFloat(match[1]);
    const unit = (match[2] || 'B').toUpperCase();

    // 计算字节数
    const unitIndex = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'].indexOf(unit);
    const bytes = unitIndex >= 0 ? value * 1024 ** unitIndex : value;

    return { value, unit, bytes };
  } catch {
    return { value: 0, unit: 'B', bytes: 0 };
  }
}

// 命令统计图表强制刷新
function forceUpdateCharts() {
  try {
    if (memoryGaugeRef.value) {
      updateMemoryChart();
    }

    if (commandChartRef.value) {
      // 更新命令统计图表
      updateCommandChart(opts => {
        // ... existing code ...
        return opts;
      });
    }
  } catch {
    // 错误已被捕获，无需处理
  }
}

// 改进组件挂载处理
onMounted(async () => {
  try {
    await getCacheInfo();
  } catch {
    fetchError.value = '初始化数据失败，请尝试刷新';
  }
});

// 确保在组件卸载时清理所有资源
onUnmounted(() => {
  stopAutoRefresh();
  // 清理图表资源
  try {
    if (commandChartRef.value) {
      commandChartRef.value = null;
    }
    if (memoryGaugeRef.value) {
      memoryGaugeRef.value = null;
    }
  } catch {
    // 错误已被捕获，无需处理
  }
});
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-y-auto lt-sm:overflow-auto">
    <NSpace vertical :size="16">
      <!-- 控制面板 -->
      <NCard :bordered="false" class="control-panel card-wrapper">
        <div class="flex flex-wrap items-center justify-between gap-y-12px">
          <h3 class="m-0 text-16px font-medium">Redis 缓存监控</h3>
          <div class="flex flex-wrap items-center gap-16px">
            <div class="flex items-center gap-8px">
              <span class="whitespace-nowrap">自动刷新：</span>
              <NSwitch v-model:value="autoRefresh" @update:value="toggleAutoRefresh" />
            </div>
            <div v-if="autoRefresh" class="flex items-center gap-8px">
              <span class="whitespace-nowrap">间隔 (秒)：</span>
              <NInputNumber
                v-model:value="refreshInterval"
                :min="5"
                :max="300"
                size="small"
                @update:value="updateRefreshInterval"
              />
            </div>
            <NButton
              type="primary"
              :loading="loading"
              :disabled="autoRefresh"
              class="min-w-80px"
              @click="handleRefresh"
            >
              {{ loading ? '刷新中...' : '刷新数据' }}
            </NButton>
          </div>
        </div>
      </NCard>

      <!-- 错误提示 -->
      <NAlert v-if="fetchError" type="error" closable>
        {{ fetchError }}
      </NAlert>

      <NCard title="Redis 基本信息" :bordered="false" class="info-card card-wrapper">
        <NSpin :show="loading">
          <NDescriptions :column="4" bordered label-placement="left" label-class="w-150px">
            <NDescriptionsItem label="Redis 版本">{{ cacheInfo?.info?.redis_version }}</NDescriptionsItem>
            <NDescriptionsItem label="运行模式">
              {{ cacheInfo?.info?.redis_mode === 'standalone' ? '单机' : '集群' }}
            </NDescriptionsItem>
            <NDescriptionsItem label="端口">{{ cacheInfo?.info?.tcp_port }}</NDescriptionsItem>
            <NDescriptionsItem label="客户端数">{{ cacheInfo?.info?.connected_clients }}</NDescriptionsItem>
            <NDescriptionsItem label="运行时间(天)">{{ cacheInfo?.info?.uptime_in_days }}</NDescriptionsItem>
            <NDescriptionsItem label="使用内存">{{ cacheInfo?.info?.used_memory_human }}</NDescriptionsItem>
            <NDescriptionsItem label="使用CPU">
              {{
                cacheInfo?.info?.used_cpu_user_children
                  ? parseFloat(cacheInfo?.info?.used_cpu_user_children).toFixed(2)
                  : ''
              }}
            </NDescriptionsItem>
            <NDescriptionsItem label="内存配置">{{ cacheInfo?.info?.maxmemory_human }}</NDescriptionsItem>
            <NDescriptionsItem label="AOF 开启">
              {{ cacheInfo?.info?.aof_enabled === '0' ? '否' : '是' }}
            </NDescriptionsItem>
            <NDescriptionsItem label="RDB 状态">
              {{ cacheInfo?.info?.rdb_last_bgsave_status }}
            </NDescriptionsItem>
            <NDescriptionsItem label="Key 数量">{{ cacheInfo?.dbSize }}</NDescriptionsItem>
            <NDescriptionsItem label="网络入口/出口">
              {{ cacheInfo?.info?.instantaneous_input_kbps }}kps/{{ cacheInfo?.info?.instantaneous_output_kbps }}kps
            </NDescriptionsItem>
          </NDescriptions>
        </NSpin>
      </NCard>

      <NGrid :cols="2" :x-gap="16" :y-gap="16" responsive="screen" item-responsive>
        <NGi span="0:24 1000:12">
          <NCard title="命令统计" :bordered="false" class="chart-card card-wrapper">
            <div ref="commandChartRef" class="h-360px overflow-hidden"></div>
          </NCard>
        </NGi>
        <NGi span="0:24 1000:12">
          <NCard title="内存信息" :bordered="false" class="chart-card card-wrapper">
            <NSpin :show="loading">
              <div ref="memoryGaugeRef" class="h-360px overflow-hidden"></div>
            </NSpin>
          </NCard>
        </NGi>
      </NGrid>
    </NSpace>
  </div>
</template>

<style scoped>
.card-wrapper {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.card-wrapper:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.control-panel {
  background: linear-gradient(to right, rgba(115, 103, 240, 0.05), rgba(115, 103, 240, 0.01));
}

.info-card {
  position: relative;
  overflow: hidden;
}

.chart-card {
  min-height: 420px;
}

@media (max-width: 768px) {
  .flex-wrap {
    flex-wrap: wrap;
  }

  .chart-card {
    min-height: 360px;
  }
}

@media (max-width: 480px) {
  .chart-card {
    min-height: 300px;
  }
}
</style>
