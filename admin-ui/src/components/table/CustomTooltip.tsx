import React, { useEffect, useMemo, useRef, useState } from 'react';

import type { CustomTooltipProps } from 'ag-grid-react';

export default (props: CustomTooltipProps) => {
    const [tooltipWidth, setTooltipWidth] = useState<number>(0); // 存储宽度的状态变量
    useEffect(() => {
        const value = props.value?.toString();
        if (value) {
            let width = 0;
            for (const char of value) {
                
                
                if (/[\u4e00-\u9fa5]/.test(char)) {
                    width += 25; // 中文字符
                } else {
                    width += 10; // 其他字符（字母、数字等）
                }
            }
            setTooltipWidth(Math.min(width, 300));
        } else {
            setTooltipWidth(0);
        }
    }, [props]);    

    return (
        <div
            style={{
                width: `${tooltipWidth}px`, // 动态宽度
                maxWidth: '300px', // 最大宽度限制
                height: 'auto', // 最大高度限制
                maxHeight: 'auto',
                backgroundColor: 'black',
                color: 'aliceblue',
                alignItems: 'center',
                borderRadius: '4px',
                display: 'flex', // 使用 flex 布局
                justifyContent: 'center' // 水平居中
            }}
        >
            <span style={{ padding: "10px" }}>
                {props.value}
            </span>
        </div >
    );
};