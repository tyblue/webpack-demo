import "babel-polyfill"; // 注意：只在入口处引用一次 (babel useBuiltIns)
import React from 'react';
import ReactDOM from 'react-dom';
import _styles from './flex-block.css';
let a="initA";let b;
const App = () => {
    return (
        <div className={`${_styles['flex-block-pre']}`}>
            <div className={`${_styles['block-up']}`} onClick={()=>{
                    try{console.log(a,b)}catch(e){
                        console.log(e.stack)
                    }
                    import("./test.js").then(({a})=>{
                        console.log(a);//和外面的a不是同一个
                        b=a();
                    })
                }
            }>
                <div className={`${_styles['flex-block-sm-out']}`}>
                    <div className={`${_styles['flex-block-sm']}`}>
                        <div className={`${_styles['absolute-in']}`}>11233234141234213414231414213412342134123412342134</div>
                    </div>
                    <div className={`${_styles['flex-block-sm']}`}>
                        <div className={`${_styles['absolute-in']}`}>11233234141234213414231414213412342134123412342134</div>
                    </div>
                    <div className={`${_styles['flex-block-sm']}`}>
                        <div className={`${_styles['absolute-in']}`}>11233234141234213414231414213412342134123412342134</div>
                    </div>
                    <div className={`${_styles['flex-block-sm']}`}>
                        <div className={`${_styles['absolute-in']}`}>11233234141234213414231414213412342134123412342134</div>
                    </div>
                </div>
                <div className={`${_styles['flex-block-md-out']}`}>
                    <div className={`${_styles['flex-block-md']}`}>
                        <div className={`${_styles['absolute-in']}`}>11233234141234213414231414213412342134123412342134</div>
                    </div>
                </div>
            </div>

            <div className={`${_styles['block-down']}`}>
                <div className={`${_styles['absolute-in']}`}>11233234141234213414231414213412342134123412342134</div>
            </div>
        </div>
    )
}

ReactDOM.render(<App />,$('#root').get(0))