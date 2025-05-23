import AGTable from "@/components/table/AGTable";
import CustomHeader from "@/components/table/CustomHeader";
import { Button } from "antd";
import { useCallback, useEffect, useState } from "react";

const SalaryAGTable = () => {
    const [rowData, setRowData] = useState();
    const [columnDefs, setColumnDefs] = useState([
        {
            field: "athlete",
            headerName: "运动员",
            headerComponent: (params: any) => {
                return CustomHeader({
                    params,
                });
            }
        },
        {
            field: "age",
            headerName: "年龄",
            headerComponent: (params: any) => {
                return CustomHeader({
                    params,
                });
            }
        },
        {
            field: "country",
            headerName: '国家信息',
            headerClass: 'country-header',
            children: [
                {
                    field: "country",
                    headerName: "国家",
                    headerComponent: (params: any) => {
                        return CustomHeader({
                            params,
                        });
                    }
                },
                {
                    field: "name",
                    headerComponent: (params: any) => {
                        return CustomHeader({
                            params,
                        });
                    }
                },
                {
                    field: "code",
                    headerComponent: (params: any) => {
                        return CustomHeader({
                            params,
                        });
                    }
                }
            ],

        },
        {
            field: "year", headerName: "年份",
            headerComponent: (params: any) => {
                return CustomHeader({
                    params,
                });
            }
        },
        {
            field: "date", headerName: "日期",
            headerComponent: (params: any) => {
                return CustomHeader({
                    params,
                });
            }
        },
        {
            field: "sport", headerName: "运动",
            headerComponent: (params: any) => {
                return CustomHeader({
                    params,
                });
            }
        },
        {
            field: "gold", headerName: "金牌",
            headerComponent: (params: any) => {
                return CustomHeader({
                    params,

                });
            }
        },
        {
            field: "silver", headerName: "银牌",
            headerComponent: (params: any) => {
                return CustomHeader({
                    params,

                });
            }
        },
        {
            field: "bronze", headerName: "铜牌",
            headerComponent: (params: any) => {
                return CustomHeader({
                    params,

                });
            }
        },
        {
            field: "total", pinned: "right", headerName: "总计", editable: false,
            headerComponent: (params: any) => {
                return CustomHeader({
                    params,

                });
            }
        },
    ]);

    useEffect(() => {
        onGridReady("");
    }, []);

    const onGridReady = useCallback((params: any) => {
        fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
            .then((resp) => resp.json())
            .then((data) => setRowData(data));
    }, []);

    return (
        <>
            <Button onClick={() => {
                console.log("获取最新列=============>", columnDefs);

            }}>获取最新列</Button>
            <AGTable
                columns={columnDefs}
                data={rowData || []}
                height={600}
                columnDragging={true}
                onColumnMoved={(e: any) => {
                    // 获取新的列顺序
                    const newOrderFields = e?.api?.getAllGridColumns?.()?.map((col: any) => col.colDef.field);
                    console.log('newOrderFields', newOrderFields);
                    const draggedField = e?.column?.colDef?.field;
                    console.log('被拖拽的列名:', draggedField);
                    if (!newOrderFields) return;

                    // 递归重排 columnDefs
                    function reorderColumns(cols: any[], order: string[]): any[] {
                        // 处理有children的情况
                        const flatCols = cols.map(col => {
                            if (col.children) {
                                return {
                                    ...col,
                                    children: reorderColumns(col.children, order)
                                }
                            }
                            return col;
                        });
                        // 按 order 排序
                        return flatCols.sort((a, b) => {
                            return order.indexOf(a.field) - order.indexOf(b.field);
                        });
                    }

                    const newColumnDefs = reorderColumns(columnDefs, newOrderFields);
                    setColumnDefs(newColumnDefs);

                    console.log("columnDragging", e);
                }}
            ></AGTable>
        </>
    );
}

export default SalaryAGTable;
