import {AgGridReact} from 'ag-grid-react';
import {AllCommunityModule, ModuleRegistry, themeQuartz,} from "ag-grid-community";
import {AG_GRID_LOCALE_CN} from '@ag-grid-community/locale';
import {useCallback, useMemo, useState} from "react";
import testCustomHeader from './testCustomHeader';

const localeText = AG_GRID_LOCALE_CN;
// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);


const myTheme = themeQuartz.withParams({
    /* Low spacing = very compact */
    spacing: 2,
    accentColor: "red",

});
const TestAGTable = () => {
    const [rowData, setRowData] = useState();
    const [columnDefs, setColumnDefs] = useState([
        {
            field: "athlete",
            headerName: "运动员",
            headerComponent: testCustomHeader,
        },
        {
            field: "age",
            headerName: "年龄",
            headerComponent: testCustomHeader,
        },
        {
            field: "country",
            headerName: '国家信息',
            headerClass: 'country-header',
            children: [
                {
                    field: "country",
                    headerName: "国家",
                },
                {field: "name"},
                {field: "code"}
            ]
        },
        {field: "year", headerName: "年份",headerComponent: testCustomHeader,},
        {field: "date", headerName: "日期",headerComponent: testCustomHeader,},
        {field: "sport", headerName: "运动",headerComponent: testCustomHeader,},
        {field: "gold", headerName: "金牌",headerComponent: testCustomHeader,},
        {field: "silver", headerName: "银牌",headerComponent: testCustomHeader,},
        {field: "bronze", headerName: "铜牌",headerComponent: testCustomHeader,},
        {field: "total", headerName: "总计", editable: false},
    ]);
    const theme = useMemo(() => {
        return myTheme;
    }, []);
    const defaultColDef = useMemo(() => {
        return {
            editable: true,
            filter: true,
            sortable: false,
        };
    }, []);

    const onGridReady = useCallback((params: any) => {
        fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
            .then((resp) => resp.json())
            .then((data) => setRowData(data));
    }, []);


    const onChange = (row:any,updateRow:(row:any)=>void,refreshColumns:()=>void)=>{
        const gold = row.gold;
        const silver = row.silver;
        const bronze = row.bronze;
        const total = gold + silver + bronze;

        updateRow({...row,total});

        // update redux store message

        refreshColumns()
    }

    return (
        <div
            // define a height because the Data Grid will fill the size of the parent container
            style={{height: 900}}
        >
            <AgGridReact
                rowData={rowData}
                localeText={localeText}
                onCellValueChanged={(event) => {
                    //@ts-ignore
                    if (['gold', 'silver', 'bronze'].includes(event.colDef.field)) {
                        onChange( event.data,(data:any)=>{
                            event.data.total = data.total;
                        },()=>{
                            event.api.refreshCells({columns: ['total']});
                        });
                    }
                }}
                columnDefs={columnDefs}
                theme={theme}
                // pagination={true}
                defaultColDef={defaultColDef}
                onGridReady={onGridReady}
            />
        </div>
    );
}

export default TestAGTable;
