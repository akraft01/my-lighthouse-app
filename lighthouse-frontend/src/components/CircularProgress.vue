<template>
    <div class="circular-progress" :style="{ width: size + 'px', height: size + 'px' }">
      <svg viewBox="0 0 36 36" class="circular-chart" :width="size" :height="size">
        <path class="circle-bg"
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831" />
        <path class="circle"
              :stroke="color"
              :stroke-dasharray="progress + ', 100'"
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831" />
      </svg>
      <div class="percentage" :style="{ fontSize: (size / 4) + 'px' }">{{ progress }}%</div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      progress: {
        type: Number,
        required: true
      },
      size: {
        type: Number,
        default: 100
      },
      color: {
        type: String,
        default: '#4caf50'
      }
    }
  };
  </script>
  
  <style scoped>
  .circular-progress {
    position: relative;
    display: inline-block;
  }
  
  .circular-chart {
    transform: rotate(-90deg);
  }
  
  .circle-bg {
    fill: none;
    stroke: #eee;
    stroke-width: 3.8;
  }
  
  .circle {
    fill: none;
    stroke-width: 2.8;
    stroke-linecap: round;
    transition: stroke-dasharray 0.6s ease 0s;
  }
  
  .percentage {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-weight: bold;
  }
  </style>
  