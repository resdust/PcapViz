// 图表统一样式
const themeColor = [
  '#f1c40f',
  '#ecf0f1',
  '#e67e22',
  '#3498db',
  '#f39c12',
  '#1abc9c',
  '#9b59b6',
  '#3498db',
];
const labelStyle = {
  textStyle: {
    color: '#fff',
    fontSize: '1rem',
    lineHeight: 20,
    padding: 3
  },
};
const titleStyle = {
  textStyle: {
    fontSize: '1.2rem',
    color: 'rgba(255, 255, 255, 0.7)',
    // textBorderColor: '#fff',
    // textBorderWidth: 1,
    textShadowColor: 'rgba(200, 200, 200, 0.3)',
    textShadowBlur: 5,
  },
};
const myItemStyle = {
  itemStyle: {
    borderRadius: 5,
    borderColor: '#fff',
    borderWidth: 1,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowBlur: 10,
  },
}
const splitLineStyle = {
  lineStyle: {
    color: "rgba(255,255,255,0.1)"
  }
};

export default {
    themeColor,
    labelStyle,
    titleStyle,
    myItemStyle,
    splitLineStyle
  }