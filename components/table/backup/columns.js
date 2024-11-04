"use client"
import moment from "moment";
import { Checkbox } from "@/components/ui/checkbox"
import {BiDotsHorizontal, BiExpandVertical} from "react-icons/bi";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {filesize} from "filesize";
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

function tempoAllaScadenza(dataCreazione, timeframeSecondi) {
    const dataCreazioneDate = new Date(dataCreazione);
    const scadenzaTimestamp = dataCreazioneDate.getTime() + timeframeSecondi * 1000;
    const oraTimestamp = Date.now();
    const tempoRimanente = scadenzaTimestamp - oraTimestamp;
    let secondi = Math.floor(tempoRimanente / 1000);
    let minuti = Math.floor(secondi / 60);
    let ore = Math.floor(minuti / 60);
    let giorni = Math.floor(ore / 24);
    return `Expires in ${giorni} days`;
}

function checkTimeDownload(dataCreazione, timeframeSecondi) {
    const dataCreazioneDate = new Date(dataCreazione);
    const scadenzaTimestamp = dataCreazioneDate.getTime() + timeframeSecondi * 1000;
    const oraTimestamp = Date.now();
    const tempoRimanente = scadenzaTimestamp - oraTimestamp;
    let secondi = Math.floor(tempoRimanente / 1000);
    let minuti = Math.floor(secondi / 60);
    let ore = Math.floor(minuti / 60);
    let giorni = Math.floor(ore / 24);
    return giorni;
}


export const backupColumns = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    className="p-0 hover:bg-transparent flex items-center gap-2"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Database Name
                    <BiExpandVertical size={14}/>
                </Button>
            )
        },
        cell: props => <>
            <div>
                <Link href={`/app/databases/console/${props.row.original.dataBaseId}`}>
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
        accessorKey: "fileSize",
        header: ({ column }) => {
            return (
                <Button
                    className="p-0 hover:bg-transparent flex items-center gap-2"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Database Size
                    <BiExpandVertical size={14}/>
                </Button>
            )
        },
        cell: props => <>
            <div>
                {filesize(props.row.original.fileSize)}
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
        accessorKey: "expiresIn",
        header: ({ column }) => {
            return (
                <Button
                    className="p-0 hover:bg-transparent flex items-center gap-2"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Expires In
                    <BiExpandVertical size={14}/>
                </Button>
            )
        },
        cell: props => <>
            {checkTimeDownload(props.row.original.createdAt, props.row.original.expiresIn) <= 0
                ? 'Expired'
                : <div>
                    {tempoAllaScadenza(props.row.original.createdAt, props.row.original.expiresIn)}
                </div>
            }
        </>
    },
    {
        accessorKey: "action",
        header: "Action",
        cell: props => <>
        <div>
                {checkTimeDownload(props.row.original.createdAt, props.row.original.expiresIn) <= 0
                    ? <Button variant="link" className="p-0 h-fit" disabled href={props.row.original.downloadUrl}>Download</Button>
                    : <Button variant="link" className="p-0 h-fit" href={props.row.original.downloadUrl}>Download</Button>
                }
            </div>
        </>
    },
]
