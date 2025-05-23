import React, {useEffect} from "react";
import {ActionType, EditableProTable, ProTable} from "@ant-design/pro-components";
import {SalaryState, updateTable2, updateTable2Version} from "@/pages/salary/store/salary";
import {useDispatch, useSelector} from "react-redux";
import {Table2UpdateService} from "@/pages/salary/data/table2";
import {Input, InputNumber} from "antd";
import {ProColumns} from "@ant-design/pro-table/es/typing";
import AGTable from "@/pages/salary/compoments/AGTable";

const SalaryTable2 = () => {

    const users = useSelector((state: SalaryState) => state.salary.users);

    const table2 = useSelector((state: SalaryState) => state.salary.table1);

    const actionRef = React.useRef<ActionType>(null);

    const dispatch = useDispatch();
    const columns = [
        {
            title: 'id',
            dataIndex: 'id',
            valueType: 'text',
            editable: false,
        },
        {
            title: '姓名',
            dataIndex: 'name',
            valueType: 'text',
            editable: true,
            // render: (text, record) => {
            //     return <Input defaultValue={record.name}/>
            // }
        },
        {
            title: '科目1',
            dataIndex: 'kemu1',
            valueType: 'digit',
            editable: true,
        },
        {
            title: '科目2',
            dataIndex: 'kemu2',
            valueType: 'digit',
            editable: true,
        },
        {
            title: '小计',
            dataIndex: 'sum',
            valueType: 'text',
            editable: true,
        }
    ]  as ProColumns[];


    for(let i=0;i<30;i++){
        columns.push(
            {
                title: '科目21'+i,
                dataIndex: 'kemu2'+i,
                //@ts-ignore
                valueType: 'digit'+i,
            },
        )
    }

    return (
        <>
            {/* <AGTable/> */}
        </>
    )
}

export default SalaryTable2;
