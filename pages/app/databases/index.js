import React, { useState } from "react";
import LayoutTopBar from "@/components/layout/layoutTopBar";
import AddDatabase from "@/components/addDatabase";
import { connect } from "react-redux";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import moment from "moment";
import {Code, MoreHorizontal, Trash2} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Databases(props) {
    const { databases } = props;
    const [selectedRows, setSelectedRows] = useState([]);

    // Update selectedRows based on checkbox clicks
    const handleRowCheckboxChange = (id) => {
        setSelectedRows((prev) => {
            if (prev.includes(id)) {
                return prev.filter((rowId) => rowId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    // Handle the master checkbox (select/deselect all)
    const handleMasterCheckboxChange = () => {
        if (selectedRows.length === databases.length) {
            setSelectedRows([]); // Deselect all if all are selected
        } else {
            setSelectedRows(databases.map((d) => d.id)); // Select all
        }
    };

    // Determine the state of the master checkbox
    const isMasterChecked = selectedRows.length === databases.length;
    const isMasterIndeterminate = selectedRows.length > 0 && selectedRows.length < databases.length;

    return (
        <LayoutTopBar title="Databases">
            <AddDatabase />
            {databases.length > 0
                ? <div className="py-4 pt-6 flex flex-col">
                    <div className="px-2 py-2 rounded-md flex items-center gap-2">
                        <div className="flex items-center !min-w-[40px]">
                            <Checkbox
                                checked={isMasterChecked}
                                indeterminate={isMasterIndeterminate}
                                onCheckedChange={handleMasterCheckboxChange}
                            />
                        </div>
                        <div className="!min-w-[340px] text-muted-foreground">Name</div>
                        <div className="!min-w-[240px] text-muted-foreground">ID</div>
                        <div className="!min-w-[100px] text-muted-foreground">Dialect</div>
                        <div className="!min-w-[120px] text-muted-foreground">Permission</div>
                        <div className="!min-w-[100px] text-muted-foreground">Type</div>
                        <div className="!min-w-[240px] text-muted-foreground">Created at</div>
                    </div>
                    {databases?.map((d, i) => {
                        const isChecked = selectedRows.includes(d.id);
                        return (
                            <div
                                key={i}
                                className={`group px-2 py-2 rounded-md flex items-center gap-2 hover:dark:bg-gray-100/5 hover:bg-gray-100 w-full ${isChecked ? 'bg-gray-100 dark:bg-gray-100/5' : ''}`} // Aggiunta della classe per il background
                            >
                                <div className="flex items-center !min-w-[40px]">
                                    <Checkbox
                                        checked={isChecked}
                                        onCheckedChange={() => handleRowCheckboxChange(d.id)}
                                    />
                                </div>
                                <label
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                                    <div
                                        className="w-[340px] truncate hover:cursor-pointer flex items-center justify-between relative">
                                        <span
                                            className="truncate max-w-[calc(100%-24px)] group-hover:max-w-[calc(100%-48px)]">{d.name}</span>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                <MoreHorizontal
                                                    size={16}
                                                    className="mr-6"
                                                />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent side="left" align="start">
                                                <DropdownMenuItem>
                                                    <Code/>
                                                    Console
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Trash2/>
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="w-[240px] truncate">
                                        <Badge variant="outline">{d.id}</Badge>
                                    </div>
                                    <div className="w-[100px] truncate">
                                        <Badge
                                            variant="outline">{d.settings.includes("mysql") ? "mysql" : "postgres"}</Badge>
                                    </div>
                                    <div className="w-[120px] truncate">
                                        <Badge variant="outline">{d.dbUserPermission}</Badge>
                                    </div>
                                    <div className="w-[100px] truncate">
                                        <Badge variant="outline">{d.isProdDb ? "prod" : "uat"}</Badge>
                                    </div>
                                    <div className="w-[240px] truncate">
                                        <Badge variant="outline">{moment(new Date(d.createdAt)).fromNow()}</Badge>
                                    </div>
                                </label>
                            </div>
                        );
                    })}
                </div>
                : <div className="py-6">
                    <span className="text-muted-foreground">No databases linked.</span>
                </div>
            }
        </LayoutTopBar>
    );
}

const mapStateToProps = (state) => {
    return {
        databases: state.databases.databases,
    };
};

export default connect(mapStateToProps, null)(Databases);
