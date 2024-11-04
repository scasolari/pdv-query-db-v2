"use client"
import moment from "moment";
import { Checkbox } from "@/components/ui/checkbox"
import {BiDotsHorizontal, BiExpandVertical} from "react-icons/bi";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {TbDots} from "react-icons/tb";
import {useState} from "react";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import axios from "axios";
import {setDatabase, setDatabases} from "@/redux/actions/main";
import {connect} from "react-redux";
import AlertDeleteDbTable from "@/components/alert/deleteDbTable";
import AlertDeleteMultipleDbTable from "@/components/alert/deleteMultipleDbTable";

export const columns = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    className="p-0 hover:bg-transparent flex items-center gap-2"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <BiExpandVertical size={14}/>
                </Button>
            )
        },
        cell: props => <>
            <div>
                <Link href={`/app/databases/console/${props.row.original.id}`}>
                    {props.row.original.name}
                </Link>
            </div>
        </>
    },
    {
        accessorKey: "id",
        header: "Database ID",
    },
    {
        accessorKey: "settings",
        header: "Database Dialect",
        cell: props => <>
            <div>
                {props.row.original.settings.includes("postgres") ? "postgres" : props.row.original.settings.includes("mysql") ? "mysql" : props.row.original.settings.includes("mariadb") ? "mariadb" : props.row.original.settings.includes("mssql") ? "mssql" : props.row.original.settings.includes("oracle") ? "oracle" : null}
            </div>
        </>
    },
    {
        accessorKey: "dbUserPermission",
        header: ({ column }) => {
            return (
                <Button
                    className="p-0 hover:bg-transparent flex items-center gap-2"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Database Permissions
                    <BiExpandVertical size={14}/>
                </Button>
            )
        },
        cell: props => <>
            <div>
                {props.row.original.dbUserPermission === "read_write" ? "Read/Write" : props.row.original.dbUserPermission === "write_only" ? "Write-only" : props.row.original.dbUserPermission === "read_only" ? "Read-only" : props.row.original.dbUserPermission === "admin" ? "Admin" : null}
            </div>
        </>
    },
    {
        accessorKey: "isProdDb",
        header: ({ column }) => {
            return (
                <Button
                    className="p-0 hover:bg-transparent flex items-center gap-2"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Database Type
                    <BiExpandVertical size={14}/>
                </Button>
            )
        },
        cell: props => <>
            <div>
                {props.row.original.isProdDb ? "Production" : "Non-production"}
            </div>
        </>
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <Button
                    className="p-0 hover:bg-transparent flex items-center gap-2"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Created At
                    <BiExpandVertical size={14}/>
                </Button>
            )
        },
        cell: props => <>
            <div>
                {moment(new Date(props.row.original.createdAt)).fromNow()}
            </div>
        </>
    },
    {
        id: "actions",
        header: ({ table }) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const [open, setOpen] = useState(false)

            return <>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <TbDots size={18} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel className="font-medium">
                            {table.getFilteredSelectedRowModel().rows.length} selected
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={() => {
                            setOpen(true)
                            console.log(table.getFilteredSelectedRowModel().rows.map(d => d.original.id))
                        }} className="hover:cursor-pointer"
                                          disabled={table.getFilteredSelectedRowModel().rows.length === 0}>
                            <p className="text-red-500">Delete selected</p>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <AlertDeleteMultipleDbTable ids={table.getFilteredSelectedRowModel().rows.map(d => d.original.id)} count={table.getFilteredSelectedRowModel().rows.length} open={open} onOpenChange={setOpen}/>
            </>
        },
        cell: props => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const [open, setOpen] = useState(false)
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const [dataBaseInfo, setDataBaseInfo] = useState({
                name: "",
                id: ""
            })
            return <>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <TbDots size={18} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                            <Link href={`/app/databases/console/${props.row.original.id}`}>
                                Console
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem className="hover:cursor-pointer" onClick={() => {
                            setDataBaseInfo({
                                name: props.row.original.name,
                                id: props.row.original.id
                            })
                            setOpen(true)
                        }}>
                            <p className="text-red-500">Delete</p>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <AlertDeleteDbTable dataBaseInfo={{
                    name: dataBaseInfo.name,
                    id: dataBaseInfo.id
                }} open={open} onOpenChange={setOpen} />
            </>
        },
    },
]
