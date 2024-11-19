import React, {Suspense, useState} from "react";
import LayoutTopBar from "@/components/layout/layoutTopBar";
import AddDatabase from "@/components/addDatabase";
import { connect } from "react-redux";
import {DataTable} from "@/components/table/dataTable";
import {columns} from "@/components/table/columns";

function Databases(props) {
    const { databases } = props;
    const [selectedRows, setSelectedRows] = useState([]);

    return (
        <LayoutTopBar title="Databases">
            <div class="mb-3">
                <AddDatabase />
            </div>

        </LayoutTopBar>
    );
}

const mapStateToProps = (state) => {
    return {
        databases: state.databases.databases,
    };
};

export default connect(mapStateToProps, null)(Databases);
