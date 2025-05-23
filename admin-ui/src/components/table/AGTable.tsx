import { AG_GRID_LOCALE_CN } from '@ag-grid-community/locale';
import {
    AllCommunityModule,
    ColDef, ModuleRegistry,
    RowSelectionOptions, themeQuartz
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CustomTooltip from './CustomTooltip';
import './index.scss';

const localeText = AG_GRID_LOCALE_CN;
ModuleRegistry.registerModules([AllCommunityModule]);

const myTheme = themeQuartz.withParams({
    spacing: 6,
    accentColor: "#1677ff",
    columnBorder: true,
    headerFontSize: 14,
});

export interface AGTableAction {
    reload: () => void
}
interface AGTableProps {
    columns: any[];
    data: any[];
    height?: string | number;
    actionRef?: React.Ref<AGTableAction>
    gridApiRef?: React.RefObject<AgGridReact>
    onChange?: (row: any) => void;
    visible?: boolean;
    setVisible?: (visible: boolean) => void;
    currentEditField?: (fieldName: string, fieldLabel: string) => void
    showDeptSubtotal?: boolean;
    showSalaryStaff?: boolean;
    jumpToSalary?: (currentTab: string) => void;
    selectedRows?: any[];
    onSelectedRows?: (rows: any[]) => void;
    loading?: boolean;
    rowSelection?: "single" | "multiple";
    pinnedBottomRowData?: any[];
    defaultPageSize?: number;
    pageSizeOptions?: number[];
    openAutoWidth?: boolean;
    isPinnedRightWidth?: boolean;
    columnDragging?: boolean;
    onColumnMoved?: (event: any) => void;
    onPaginationChanged?: (currentPage: number, pageSize: number, totalPages: number) => void;
}

const AGTable: React.FC<AGTableProps> = (props) => {
    const {columnDragging, onColumnMoved}  = props;
     // 修改分页变化事件处理函数
     const [paginationState, setPaginationState] = useState({
        currentPage: 0,
        pageSize: props.defaultPageSize || 500,
        totalPages: 0
    });
    const [random, setRandom] = React.useState(0);
    const gridApiRef = useRef<AgGridReact>(null);
    // 需要合并的字段列表
    const theme = useMemo(() => {
        return myTheme;
    }, []);


    const defaultColDef = useMemo<ColDef>(() => {
        return {
            editable: false,
            filter: true,
            sortable: false,
            headerComponentParams: {
                menuIcon: "fa-bars",
            },
            suppressMovable: !columnDragging,
            enableFilterButton: true,
            tooltipComponent: CustomTooltip,

        };
    }, [columnDragging]);

    // 添加一个 useEffect 来动态设置 CSS 变量
    useEffect(() => {
        if (props.isPinnedRightWidth) {
            // 设置 CSS 变量
            document.documentElement.style.setProperty('--pinned-right-width', `4px`);
        }
    }, [props.isPinnedRightWidth]);

    React.useImperativeHandle(props.actionRef, () => {
        return {
            reload: () => {
                setRandom(Math.random());
            },
        }
    }, [props.actionRef]);

    const getRowStyle = (params: any) => {

        if (params.data.isSubtotal) {
            return {
                background: '#ffebeb',
                fontWeight: 'bold',
                textAlign: 'center',
            };
        }
        if (params.data.isWarning) {
            return {
                background: '#ff5040',
                fontWeight: '',
                textAlign: 'center',
            };
        }

        return {
            background: '#ffffff',
            fontWeight: '',
            textAlign: 'center',
        };
    };

    const autoSizeStrategy = useMemo(() => {
        if (!props.openAutoWidth) {
            return undefined;
        }
        return {
            type: "fitCellContents" as const,
            skipHeader: false
        };
    }, [props.openAutoWidth]);

    const selectionColumnDef = useMemo(() => {
        if (!props.rowSelection) {
            return undefined;
        }
        return {
            checkboxSelection: true,  // 启用复选框
            headerCheckboxSelection: true,
            pinned: 'left',           // 固定到左侧
            width: 50,                // 设置列宽
            suppressMenu: true,       // 隐藏列菜单
            filter: false,            // 禁用过滤
            sortable: false           // 禁用排序
        };
    }, []);

    const rowSelection = useMemo<RowSelectionOptions | "single" | "multiple" | undefined>(() => {
        if (!props.rowSelection) {
            return undefined;
        }
        return {
            mode: props.rowSelection === "multiple" ? "multiRow" : "singleRow",
        };
    }, [props.rowSelection]);

    const handlePaginationChanged = useCallback((event: any) => {
        if (props.onPaginationChanged && gridApiRef.current && gridApiRef.current.api) {
            const api = gridApiRef.current.api;
            const currentPage = api.paginationGetCurrentPage() + 1; // AG Grid 页码从0开始
            const pageSize = api.paginationGetPageSize();
            const totalPages = api.paginationGetTotalPages();
            
            // 只有当分页状态真正变化时才触发回调
            if (currentPage !== paginationState.currentPage || 
                pageSize !== paginationState.pageSize || 
                totalPages !== paginationState.totalPages) {
                
                setPaginationState({
                    currentPage,
                    pageSize,
                    totalPages
                });
                
                // 只有在表格数据加载完成后才触发回调
                if (props.data && props.data.length > 0) {
                    props.onPaginationChanged(currentPage, pageSize, totalPages);
                }
            }
        }
    }, [props.onPaginationChanged, gridApiRef, paginationState, props.data]);

    return (
        <div
            className="ag-theme-quartz custom-scrollbar"
            style={{
                height: props.height,
                width: '100%',
            }}
        >
            <AgGridReact
                loading={props.loading}
                ref={gridApiRef}
                rowData={props.data}
                localeText={localeText}
                onCellValueChanged={(event) => {
                    props.onChange?.(event.data); 
                }}
                columnDefs={props.columns as any[]}
                theme={theme}
                pagination={true}
                tooltipShowDelay={0} // 显示 工具提示的时间
                tooltipMouseTrack={true} //显示工具提示
                singleClickEdit={false}
                defaultColDef={defaultColDef}
                paginationPageSize={props.defaultPageSize || 500}
                paginationPageSizeSelector={props.pageSizeOptions || [100, 200, 500, 1000]}
                getRowStyle={getRowStyle}
                selectionColumnDef={selectionColumnDef as any}
                rowSelection={rowSelection}
                onSelectionChanged={(event) => {
                    props.onSelectedRows?.(event.api.getSelectedNodes().map((node: any) => node.data));
                }}
                pinnedBottomRowData={props.pinnedBottomRowData || []}
                suppressScrollOnNewData={false}
                autoSizeStrategy={autoSizeStrategy}
                onPaginationChanged={handlePaginationChanged}
                onColumnMoved={onColumnMoved}
            />
        </div>
    );
}

export default AGTable;
