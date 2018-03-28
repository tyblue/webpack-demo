/**
 * （charge） equal
 */
function equal(old, target) {
  let r = true;
  for (const prop in old) {
    if (typeof old[prop] === 'function' && typeof target[prop] === 'function') {
      if (old[prop].toString() != target[prop].toString()) {
        r = false;
      }
    } else if (old[prop] != target[prop]) {
      r = false;
    }
  }
  return r;
}

componentWillReceiveProps = (nextProps) => {
    if (!equal(this.props, nextProps)){
      this.setState({...nextProps})
    }
  }
componentDidUpdate = (prevProps, prevState) => {
    if (!equal(this.state, prevState)){
      const {dataSource} = this.state;
      const {dispatch} = this.props;
      // console.log(this.state,"更新-----") 把更新同步到 顶层store
      dispatch({type:'charge/setParams',payload:{dataSource:dataSource}}) 
      this.setState( {loading:false} )
    }
}
<Table dataSource={this.state.loading==false&&dataSource||[]}/>

/**
 * 对象转url字符串；也可以引入 qs
 */
function toQueryString(obj) {
    return obj ? Object.keys(obj).sort().map(function (key) {
        var val = obj[key];
        if (Array.isArray(val)) {
            return val.sort().map(function (val2) {
                return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
            }).join('&');
        }

        return encodeURIComponent(key) + '=' + encodeURIComponent(val);
    }).join('&') : '';
}

/**
 * 尾递归优化 解决栈stack溢出 （递归转循环）
 */
function tco(f) {
  var value;var active = false;var accumulated = [];

  return function accumulator() {
    accumulated.push(arguments);
    if (!active) {
      active = true;
      while (accumulated.length) {
        value = f.apply(this, accumulated.shift());
      }
      active = false;
      return value;
    }
  };
}

var sum = tco(function(x, y) {
  if (y > 0) {
    return sum(x + 1, y - 1)
  }
  else {
    return x
  }
});

sum(1, 100000)
// 100001

/**
 * 蹦床函数 解决栈stack溢出
 */
function trampoline(f) {
  while (f && f instanceof Function) {
    f = f();
  }
  return f;
}

function sum(x, y) {
  if (y > 0) {
    return sum.bind(null, x + 1, y - 1);
  } else {
    return x;
  }
}

trampoline(sum(1, 100000))

/*
* 进入全屏
* */
function onEnterFullScreen() {
    var de = document.documentElement;
    if (de.requestFullscreen) {
        de.requestFullscreen();
    } else if (de.mozRequestFullScreen) {
        de.mozRequestFullScreen();
    } else if (de.webkitRequestFullScreen) {
        de.webkitRequestFullScreen();
    } else if (de.msRequestFullscreen) {
        de.msRequestFullscreen();
    }
    // setFullScreenBtnDislpay(false, true);
}
/*
* 退出全屏
* */
function onLeaveFullScreen() {
    var de = document;
    if (de.exitFullscreen) {
        de.exitFullscreen();
    } else if (de.mozCancelFullScreen) {
        de.mozCancelFullScreen();
    } else if (de.webkitCancelFullScreen) {
        de.webkitCancelFullScreen();
    } else if (de.msExitFullscreen) {
        de.msExitFullscreen();
    }
    // setFullScreenBtnDislpay(true, false);
}

/**
 * 拷贝 实例还有原型
 */
//{ ...a } 【等同于Object.assign({}, a)】只拷贝实例
// const obj = {
//   ...(x > 1 ? {a: 1} : {}),         //!!
//   b: 2,
// };

// 写法一 __proto__属性在非浏览器的环境不一定部署；不推荐
const clone1 = {
  __proto__: Object.getPrototypeOf(obj),
  ...obj
};

// 写法二
const clone2 = Object.assign(
  Object.create(Object.getPrototypeOf(obj)),
  obj
);

// 写法三
const clone3 = Object.create(
  Object.getPrototypeOf(obj),
  Object.getOwnPropertyDescriptors(obj)
)

/**
 * webpack支持的import() 类似实现
 */
// <script async是下载完就执行（可能不会按顺序）  或者defer（异步按顺序，但内联<script>代码会忽略defer属性）
function importModule(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const tempGlobal = "__tempModuleLoadingVariable" + Math.random().toString(32).substring(2);
    script.type = "module";
    script.textContent = `import * as m from "${url}"; window.${tempGlobal} = m;`;

    script.onload = () => {
      resolve(window[tempGlobal]);
      delete window[tempGlobal];
      script.remove();
    };

    script.onerror = () => {
      reject(new Error("Failed to load module script with URL " + url));
      delete window[tempGlobal];
      script.remove();
    };

    document.documentElement.appendChild(script);
  });
}