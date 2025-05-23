import { Button, Tooltip } from 'antd';
import 'font-awesome/css/font-awesome.min.css';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface CustomHeaderAction {
    currentEditField?: (fieldName: string, fieldLabel: string) => void;
    countFormulaHandle?: (params: any) => void;
    createSplit?: (params: any) => void;
    loadJump?: (params: any) => void;
    setVisible?: (visible: boolean) => void;
    jumpToSalary?: (currentTab: string) => void;
    isHideButton?: boolean;
    deleteSplit?: (params: any) => void;
}

export interface MyCustomHeaderProps {
    params: any;
    type?: string;
    isSplit?: boolean;
    customHeaderAction?: CustomHeaderAction;
    tooltipContent?: any;
}

const CustomHeader: React.FC<MyCustomHeaderProps> = (props) => {
    const { params, type, isSplit, customHeaderAction, tooltipContent } = props;

    // 使用useRef替换为useCallback以优化性能
    const onMenuClicked = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        const menuButton = event.currentTarget;
        params.showColumnMenu(menuButton);
    }, [params]);

    // 提取公共的菜单按钮组件
    const MenuButton = useCallback(() => (
        <div
            className="menu-button"
            style={{ marginRight: '4px', cursor: 'pointer' }}
            onClick={onMenuClicked}
        >
            <i className="fa fa-bars" />
        </div>
    ), [onMenuClicked]);

    // 提取公共的点击事件处理函数
    const handleClick = useCallback((handler?: Function, ...args: any[]) => (e: React.MouseEvent) => {
        e.stopPropagation();
        handler?.(...args);
    }, []);



    // 根据不同类型渲染不同的内容
    const renderContent = () => {
        switch (type) {
            // case 'editor':
                // if (!isSplit) {
                //     return (
                //         <>
                //             <span
                //                 style={{ marginRight: '4px' }}
                //             >{params.displayName}</span>
                //             {!customHeaderAction?.isHideButton && (
                //                 <>
                                    
                //                     <Button
                //                         type="link"
                //                         size="small"
                //                         onClick={handleClick(() => {
                //                             customHeaderAction?.currentEditField?.(params.column?.colId, params.displayName);
                //                             customHeaderAction?.setVisible?.(true);
                //                         })}
                //                     >
                //                         批量
                //                     </Button>
                //                 </>
                //             )}
                //             <MenuButton />
                //         </>
                //     );
                // }
                // return (
                //     <>
                //         <span
                //             style={{ marginRight: '4px', color: '#51A6FF', cursor: 'pointer' }}
                //             onClick={handleClick(customHeaderAction?.jumpToSalary, params.column?.colId)}
                //         >
                //             {params.displayName}
                //         </span>
                //         {!customHeaderAction?.isHideButton && (
                //             <>
                                
                //             </>
                //         )}
                //         <MenuButton />
                //     </>
                // );

            // case 'load':
            //     return (
            //         <>
            //             <div
            //                 style={{ marginRight: '4px', color: '#52c41a', cursor: 'pointer' }}
            //                 onClick={handleClick(customHeaderAction?.loadJump, params)}
            //             >
            //                 {params.displayName}
            //             </div>
            //             <MenuButton />
            //         </>
            //     );

            // case 'calculate':
            //     return (
            //         <>
            //             <Tooltip
            //                 color='#f1f1f1'
            //                 title={
            //                     ''
            //                 }
            //             >
            //                 <div
            //                     style={{ marginRight: '4px', color: '#EF8F22', cursor: 'pointer' }}
            //                     onClick={handleClick(customHeaderAction?.countFormulaHandle, params)}
            //                 >
            //                     {params.displayName}
            //                 </div>
            //             </Tooltip>
            //             <MenuButton />
            //         </>
            //     );

            // case 'batchEditor':
            //     return (
            //         <>
            //             <span
            //                 style={{ marginRight: '4px' }}
            //             >{params.displayName}</span>
            //             <Button
            //                 type="link"
            //                 size="small"
            //                 onClick={handleClick(() => {
            //                     customHeaderAction?.currentEditField?.(params.column?.colId, params.displayName);
            //                     customHeaderAction?.setVisible?.(true);
            //                 })}
            //             >
            //                 批量
            //             </Button>
            //             <MenuButton />
            //         </>
            //     )

            case 'tooltip':
                return (
                    <>
                        <Tooltip
                            color='#fafafa'
                            style={{
                                boxShadow: '3px 3px 10px rgba(0, 0, 0, 0)',
                                border: '1px solid black'
                            }}
                            title={(<div style={{ color: 'black' }}
                                dangerouslySetInnerHTML={{
                                    __html: typeof tooltipContent === 'string' ? tooltipContent :
                                        tooltipContent[params.column?.colId] != null ? tooltipContent[params.column?.colId] : ''
                                }} />)}
                        >
                            <div
                                style={{ marginRight: '4px' }}
                            >
                                {params.displayName}
                            </div>
                        </Tooltip>
                    </>
                )

            case 'baseField':
                return (
                    <>
                        <div
                            style={{ marginRight: '4px' }}
                        >{params.displayName}</div>
                        <MenuButton />
                    </>
                );

            default:
                return <div
                    style={{ marginRight: '4px' }}
                >{params.displayName}</div>;
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                width: '100%'
            }}
        >
            {renderContent()}
        </div>
    );
};

export default CustomHeader;